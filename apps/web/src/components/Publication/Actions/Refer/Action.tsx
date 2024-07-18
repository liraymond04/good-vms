import type { FC } from 'react';
import type { Address } from 'viem';

import { ERC20Token } from '@good/abis';
import { Errors } from '@good/data';
import { GOOD_REFERRAL, MAX_UINT256 } from '@good/data/constants';
import formatAddress from '@good/helpers/formatAddress';
import { Button, Spinner } from '@good/ui';
import cn from '@good/ui/cn';
import errorToast from '@helpers/errorToast';
import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useActOnReferralOpenAction from 'src/hooks/useActOnReferralOpenAction';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

const submitButtonClassName = 'w-full py-1.5 text-sm font-semibold';

interface ActionProps {
  amount: bigint;
  closePopover: () => void;
  referrers: Address[];
  rootPublicationId: Address;
  tokenAddress: Address;
  triggerConfetti: () => void;
}

const Action: FC<ActionProps> = ({
  amount,
  closePopover,
  referrers,
  rootPublicationId,
  tokenAddress,
  triggerConfetti
}) => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: tokenAddress
  });

  const { data, isLoading: isGettingAllowance } = useReadContract({
    abi: ERC20Token,
    address: tokenAddress,
    args: [address!, GOOD_REFERRAL],
    functionName: 'allowance',
    query: { refetchInterval: 2000 }
  });

  const { data: txHash, writeContractAsync } = useWriteContract();

  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) }
  });

  const [isLoading, setIsLoading] = useState(false);

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const allowance = parseFloat(data?.toString() || '0');
  const selectedCurrency = useMemo(() => {
    return allowedTokens.find(
      (t) => t.contractAddress.toLowerCase() === tokenAddress?.toLowerCase()
    );
  }, [allowedTokens, tokenAddress]);
  const usdRate =
    fiatRates.find(
      (rate) => rate.address.toLowerCase() === tokenAddress.toLowerCase()
    )?.fiat || 0;
  const cryptoRate = !usdRate
    ? Number(amount)
    : Number((Number(amount) / usdRate).toFixed(2));
  const finalRate = cryptoRate * 10 ** Number(selectedCurrency?.decimals || 18);

  const balance = balanceData
    ? parseFloat(
        formatUnits(balanceData.value, selectedCurrency?.decimals || 18)
      ).toFixed(3)
    : 0;
  const canPerformReferralAction = Number(balance) >= cryptoRate;

  const { makeDonation } = useActOnReferralOpenAction({
    publicationId: rootPublicationId,
    referrers
  });

  const enableCurrency = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();
      await writeContractAsync({
        abi: [
          {
            inputs: [
              { internalType: 'address', type: 'address' },
              { internalType: 'uint256', type: 'uint256' }
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', type: 'bool' }],
            type: 'function'
          }
        ],
        address: tokenAddress,
        args: [GOOD_REFERRAL, MAX_UINT256],
        functionName: 'approve'
      });
      return;
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefer = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);

      await makeDonation({ amount, tokenAddress: tokenAddress });

      closePopover();
      triggerConfetti();
      return;
    } catch (error) {
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasAllowance = allowance >= finalRate;
  if (!currentProfile) {
    return (
      <div className="m-5">
        <Button
          className={submitButtonClassName}
          onClick={() => {
            if (!currentProfile) {
              closePopover();
              setShowAuthModal(true);
              return;
            }
          }}
        >
          Log in to perform a referral action
        </Button>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="m-5 space-y-3 text-sm font-bold">
        <div>Connect to correct wallet to perform a referral action!</div>
        <div className="ld-text-gray-500">
          Switch to: {formatAddress(currentProfile?.ownedBy.address)}
        </div>
      </div>
    );
  }

  return (
    <div className="m-5 space-y-3">
      <div className="space-y-2">
        <div className="ld-text-gray-500 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <span>Balance:</span>
            <span>
              {balanceData ? (
                `${balance} ${selectedCurrency?.symbol}`
              ) : (
                <div className="shimmer h-2.5 w-14 rounded-full" />
              )}
            </span>
          </div>
        </div>
      </div>
      {isLoading || isWaitingForTransaction || isGettingAllowance ? (
        <Button
          className={cn('flex justify-center', submitButtonClassName)}
          disabled
          icon={<Spinner className="my-0.5" size="xs" />}
        />
      ) : !hasAllowance ? (
        <Button
          className={submitButtonClassName}
          disabled={isLoading}
          onClick={enableCurrency}
        >
          Enable referral actions for {selectedCurrency?.symbol}
        </Button>
      ) : (
        <Button
          className={submitButtonClassName}
          disabled={!amount || isLoading || !canPerformReferralAction}
          onClick={handleRefer}
        >
          {usdRate ? (
            <>
              <b>Spend ${Number(amount)}</b>
              <span className="font-light">
                ({cryptoRate} {selectedCurrency?.symbol})
              </span>
            </>
          ) : (
            <b>
              Spend {Number(amount)} {selectedCurrency?.symbol}
            </b>
          )}
        </Button>
      )}
    </div>
  );
};

export default Action;
