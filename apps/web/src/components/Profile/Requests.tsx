import type { AllowedToken } from '@good/types/good';

import { Button, Card } from '@good/ui';
import { CheckCircleIcon, MinusIcon, PlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { Tooltip } from '@good/ui';
import { Errors } from '@good/data';

import { useState } from 'react';

import errorToast from '@helpers/errorToast';
import toast from 'react-hot-toast';

import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';

import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useTipsStore } from 'src/store/non-persisted/useTipsStore';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import { Address, formatUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

import {
  APP_NAME,
  DEFAULT_COLLECT_TOKEN,
  GOOD_API_URL,
  SEND_TOKENS,
  MAX_UINT256,
  STATIC_IMAGES_URL
} from '@good/data/constants';
import { SendTokens } from '@good/abis/SendTokens';

const Requests = () => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();
  const [isLoading, setIsLoading] = useState(false);

  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();

  const { address } = useAccount();

  // placeholder for requests fetch
  const requests = [
    // {
    //   volunteerName: "Volunteer Name",
    //   volunteerProfile: "0x0",
    //   publicationUrl: "0x01",
    //   amount: "Amount",
    //   currency: "Currency",
    //   hours: "Hours",
    //   date: "YYYY-MM-DD",
    // },
    {
      volunteerName: "SEND GOOD TO SELF",
      volunteerProfile: "0x0",
      publicationUrl: "0x01",
      amount: 10,
      currency: "GOOD",
      hours: 5,
      date: "2022-01-01",
    },
    {
      volunteerName: "SEND VHR TO SELF",
      volunteerProfile: "0x0",
      publicationUrl: "0x01",
      amount: 10,
      currency: "VHR",
      hours: 5,
      date: "2022-01-02",
    },
  ];
  

  const { data: txHash, writeContractAsync } = useWriteContract({
    mutation: {
      onError: (error: Error) => {
        console.error('Error: ', error);
      },
      onSuccess: (hash: string) => {
        console.log('Transaction hash:', hash);
      }
    }
  });

  const { isLoading: isWaitingForTransaction } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) }
  });

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  // const allowance = parseFloat((data as unknown)?.toString() || '0');

  // const balance = balanceData
  //   ? parseFloat(
  //       formatUnits(balanceData.value, selectedCurrency?.decimals || 18)
  //     ).toFixed(3)
  //   : 0;
  // const canSend = Number(balance) >= cryptoRate;

  const enableSending = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      await handleWrongNetwork();
      // approve VHR
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
        address: allowedTokens.find(
          (token) => token.symbol === 'VHR'
        )?.contractAddress as Address,
        args: [SEND_TOKENS, MAX_UINT256],
        functionName: 'approve'
      });
      // approve GOOD
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
        address: allowedTokens.find(
          (token) => token.symbol === 'GOOD'
        )?.contractAddress as Address,
        args: [SEND_TOKENS, MAX_UINT256],
        functionName: 'approve'
      });
      console.log('Allowance enabled for GOOD');
      
    } catch (error) {
      onError(error);
    }
    setIsLoading(false);
    };

  const handleSendTokens = async (request: any) => {
    if (isLoading) return;
    setIsLoading(true);
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }
    try {
      let currencyAddress = `` as Address;
      if (request.currency === 'VHR') {
        currencyAddress = allowedTokens.find(
          (token) => token.symbol === 'VHR'
        )?.contractAddress as Address;
      } 
      else if (request.currency === 'GOOD') {
        currencyAddress = allowedTokens.find(
          (token) => token.symbol === 'GOOD'
        )?.contractAddress as Address;
      }

      // get final rate
      const usdRate =
        fiatRates.find(
          (rate) => rate.address === currencyAddress.toLowerCase()
        )?.fiat || 0;
      const cryptoRate = !usdRate ? request.amount : Number((request.amount / usdRate).toFixed(2));
      const finalRate = cryptoRate * 10 ** (18);

      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: SendTokens,
        address: SEND_TOKENS,
        args: [
          currencyAddress,
          currentProfile?.ownedBy.address,
          finalRate,
          currentProfile?.id,
          currentProfile?.id,
          request.publicationUrl
        ],
        functionName: 'sendTokens'
      });
    return;
  } catch (error) {
    onError(error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Card className="space-y-3 p-5">
      <div> Incoming Requests: {requests.length}</div>

      <div style={{ display: 'flex', gap: '6rem' }}>
        <span>
          <label htmlFor="sortBy">Sort By: </label>
          <select className="rounded-xl" id="sortBy" name="Date">
            <option selected>Name</option>
            <option>Amount</option>
          </select>
        </span>
        <span>
          <label htmlFor="filterBy">Filter By: </label>
          <select className="rounded-xl" id="filterBy" name="Amount">
            <option selected>Hours</option>
            <option>Amount</option>
          </select>
        </span>
      </div>
      <Button onClick={enableSending}>Enable Sending GOOD and VHR</Button>

      {requests.map((request, index) => (
        <div
          key={index}
          className="flex w-full items-center justify-between space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          id="goodRequest"
        >
          <span className="">{request.volunteerName}</span>
          <span className="">{request.amount} {request.currency === 'VHR' ? 'VHR' : request.currency === 'GOOD' ? 'GOOD' : null}</span>
          <span className="">{request.hours}h</span>
          <span className="">{request.date}</span>
          <span className="py-2">
          <Tooltip className=""  content="Deny" placement="top">
            <button className='rounded-full outline-offset-8' style={{ verticalAlign: 'middle' }}>
              <XCircleIcon className="size-8" />
            </button>
          </Tooltip>
          <Tooltip className="ml-5" content="Accept" placement="top">
            <button className="rounded-full outline-offset-8" onClick={() => handleSendTokens(request)} style={{ verticalAlign: 'middle' }}>
              <CheckCircleIcon className="size-8" />
            </button>
          </Tooltip>
          </span>
        </div>
      ))}
    </Card>
  );
};


export default Requests;
