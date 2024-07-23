import type { Address } from 'viem';

import { SendTokens } from '@good/abis/SendTokens';
import { Errors } from '@good/data';
import { MAX_UINT256, SEND_TOKENS } from '@good/data/constants';
import { Button, Card, Tooltip } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { CheckCircleIcon, XCircleIcon, ArchiveBoxArrowDownIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useRatesStore } from 'src/store/persisted/useRatesStore';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';

// import encodeAbiParameters
import { encodeAbiParameters } from 'viem';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

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
      organizationName: '0x01',
      donorId: '0x02',
      amount: 1,
      currencyRequested: 'MoneyDonation',
      hours: 0,
      volunteerName: 'SEND GOOD (USD)',
      publicationId: '0x03',
      date: '2022-01-01',
    }
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
        address: allowedTokens.find((token) => token.symbol === 'VHR')
          ?.contractAddress as Address,
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
        address: allowedTokens.find((token) => token.symbol === 'GOOD')
          ?.contractAddress as Address,
        args: [SEND_TOKENS, MAX_UINT256],
        functionName: 'approve'
      });
    } catch (error) {
      onError(error);
    }
    setIsLoading(false);
  };

  const handleSendTokens = async (request: any) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }
    try {
      let currencyAddress = `` as Address;
      if (request.currencyRequested === 'VHR') {
        currencyAddress = allowedTokens.find((token) => token.symbol === 'VHR')
          ?.contractAddress as Address;
      } else if (request.currencyRequested === 'TimeDonation' || request.currencyRequested === 'MoneyDonation') {
        currencyAddress = allowedTokens.find((token) => token.symbol === 'GOOD')
          ?.contractAddress as Address;
      }

      // Rate variables
      let GOODRate = 0;
      let finalGOODRate = 0;
      let totalGOOD = 0;
      let VHRRate = 0;
      let finalVHRRate = 0;

      let usdRate =
        fiatRates.find((rate) => rate.address === currencyAddress.toLowerCase())
          ?.fiat || 0;

      // Use GOOD rate if request is Time or Money donation
      if (request.currencyRequested !== 'VHR') {
        GOODRate = !usdRate ? request.amount : Number((request.amount / usdRate).toFixed(2));
        finalGOODRate = GOODRate * 10 ** 18;
        if (request.currencyRequested === 'MoneyDonation') {
          totalGOOD = (finalGOODRate * 0.003) / 0.0001;
        } else if (request.currencyRequested === 'TimeDonation') {
          totalGOOD = (finalGOODRate * 30 * 0.003) / 0.0001;
        }
      } else { 
        finalVHRRate = request.amount * 10 ** 18;
      }

      setIsLoading(true);
      const hash = writeContractAsync({
        abi: SendTokens,
        address: SEND_TOKENS,
        args: [
          currentProfile?.ownedBy.address,
          totalGOOD,
          // finalVHRRate, // 1 VHR == 1 hour
          currentProfile?.id,
          currentProfile?.id,
          request.publicationId,
          currentProfile?.ownedBy.address
        ],
        functionName: 'sendGood'
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
    className="grid grid-cols-[180px,auto,auto,auto,auto] gap-2 w-full items-center rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
    id="goodRequest"
    key={index}
  >
    <span className="">{request.volunteerName}</span>
    <span className="">
      {request.currencyRequested === 'MoneyDonation' ? '$' : null}
      {request.amount} {request.currencyRequested === 'VHR' || request.currencyRequested === 'TimeDonation' ? 'VHR' : null}
    </span>
    <span className="">{request.hours}h</span>
    <span className="">{request.date}</span>
    <span className="py-2 justify-self-end">
      <Tooltip className="" content="Deny" placement="top">
        <button
          className="rounded-full outline-offset-8"
          style={{ verticalAlign: 'middle' }}
        >
          <XCircleIcon className="size-8" />
        </button>
      </Tooltip>
      <Tooltip className="" content="Accept" placement="top">
        <button
          className="rounded-full outline-offset-8"
          onClick={() => handleSendTokens(request)}
          style={{ verticalAlign: 'middle' }}
        >
          <CheckCircleIcon className="size-8" />
        </button>
      </Tooltip>
      <Tooltip className="" content="Set to in-review" placement="top">
        <button
          className="rounded-full outline-offset-8"
          style={{ verticalAlign: 'middle' }}
          // onClick={() => handleSetInReview(request)}
        >
          <ArchiveBoxArrowDownIcon className="size-8" />
        </button>
      </Tooltip>
    </span>
  </div>
))}
    </Card>
  );
};

export default Requests;
