import type { MirrorablePublication } from '@good/lens';
import type { AllowedToken } from '@good/types/good';
import type { FC } from 'react';
import type { Address } from 'viem';

import { Errors } from '@good/data';
import {
  DEFAULT_COLLECT_TOKEN,
  GOOD_REFERRAL,
  MAX_UINT256,
  STATIC_IMAGES_URL
} from '@good/data/constants';
import formatAddress from '@good/helpers/formatAddress';
import { Button, Input, Select, Spinner } from '@good/ui';
import cn from '@good/ui/cn';
import errorToast from '@helpers/errorToast';
import { useRef, useState } from 'react';
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
  closePopover: () => void;
  publication: MirrorablePublication;
  referrers: Address[];
  rootPublicationId: Address;
  triggerConfetti: () => void;
}

const Action: FC<ActionProps> = ({
  closePopover,
  publication,
  referrers,
  rootPublicationId,
  triggerConfetti
}) => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();
  const { setShowAuthModal } = useGlobalModalStateStore();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(2);
  const [other, setOther] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    allowedTokens.find(
      (token) => token.contractAddress === DEFAULT_COLLECT_TOKEN
    ) || null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    query: { refetchInterval: 2000 },
    token: selectedCurrency?.contractAddress as Address
  });

  const currencyAddress: Address = selectedCurrency
    ? (selectedCurrency.contractAddress as Address)
    : '0x00';
  const { data, isLoading: isGettingAllowance } = useReadContract({
    address: currencyAddress,
    args: [address!, GOOD_REFERRAL],
    functionName: 'allowance',
    query: { refetchInterval: 2000 }
  });

  const { data: txHash, writeContractAsync } = useWriteContract();

  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) }
  });

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const allowance = parseFloat(data?.toString() || '0');
  const usdRate =
    fiatRates.find(
      (rate) => rate.address === selectedCurrency?.contractAddress.toLowerCase()
    )?.fiat || 0;
  const cryptoRate = !usdRate ? amount : Number((amount / usdRate).toFixed(2));
  const finalRate = cryptoRate * 10 ** (selectedCurrency?.decimals || 18);

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

  const onSetAmount = (amount: number) => {
    setAmount(amount);
    setOther(false);
  };

  const onOtherAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as number;
    setAmount(value);
  };

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
        address: selectedCurrency?.contractAddress as Address,
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

      if (!selectedCurrency) {
        throw new Error('no currency selected');
      }

      await makeDonation({
        amount: BigInt(amount),
        tokenAddress: selectedCurrency.contractAddress as Address
      });

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
  const amountDisabled =
    isLoading ||
    !currentProfile ||
    !hasAllowance ||
    isWaitingForTransaction ||
    isGettingAllowance;

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
        <Select
          className="py-1.5 text-sm"
          iconClassName="size-4"
          onChange={(value) => {
            setAmount(2);
            setSelectedCurrency(
              allowedTokens?.find((token) => token.contractAddress === value) ||
                null
            );
          }}
          options={allowedTokens?.map((token) => ({
            icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
            label: token.name,
            selected:
              token.contractAddress === selectedCurrency?.contractAddress,
            value: token.contractAddress
          }))}
        />
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
      <div className="space-x-4">
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(2)}
          outline={amount !== 2}
          size="sm"
        >
          {usdRate ? '$' : ''}2
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(5)}
          outline={amount !== 5}
          size="sm"
        >
          {usdRate ? '$' : ''}5
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => onSetAmount(10)}
          outline={amount !== 10}
          size="sm"
        >
          {usdRate ? '$' : ''}10
        </Button>
        <Button
          disabled={amountDisabled}
          onClick={() => {
            onSetAmount(other ? 2 : 20);
            setOther(!other);
          }}
          outline={!other}
          size="sm"
        >
          Other
        </Button>
      </div>
      {other ? (
        <div>
          <Input
            className="no-spinner"
            max={1000}
            onChange={onOtherAmount}
            placeholder="300"
            ref={inputRef}
            type="number"
            value={amount}
          />
        </div>
      ) : null}
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
              <b>Spend ${amount}</b>{' '}
              <span className="font-light">
                ({cryptoRate} {selectedCurrency?.symbol})
              </span>
            </>
          ) : (
            <b>
              Spend {amount} {selectedCurrency?.symbol}
            </b>
          )}
        </Button>
      )}
    </div>
  );
};

export default Action;
