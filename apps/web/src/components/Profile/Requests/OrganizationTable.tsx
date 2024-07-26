import type { AnyPublication } from '@good/lens';
import type { Address } from 'viem';

import { SendTokens } from '@good/abis/SendTokens';
import { Errors } from '@good/data';
import { MAX_UINT256, SEND_TOKENS } from '@good/data/constants';
import { Button, Card, Tooltip } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
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

interface RequestData {
  amount: number;
  currency: string;
  date: string;
  hours: number;
  publicationUrl: string;
  status: string;
  volunteerName: string;
  volunteerProfile: string;
}
interface OrganizationTableProps {
  onRequestClose: () => void;
  onRequestOpen: (request: RequestData) => void;
  publications: AnyPublication[];
  selectedRequest: AnyPublication | null | RequestData;
  showRequest: boolean;
}
const OrganizationTable: React.FC<OrganizationTableProps> = ({
  onRequestOpen,
  publications
}) => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const { fiatRates } = useRatesStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<null | RequestData>(
    null
  );
  const [filterCurrency, setFilterCurrency] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const { isSuspended } = useProfileStatus();
  const handleWrongNetwork = useHandleWrongNetwork();
  const { address } = useAccount();

  // Placeholder for requests fetch
  const initialRequests: RequestData[] = [
    {
      amount: 10,
      currency: 'GOOD',
      date: '2022-01-01',
      hours: 5,
      publicationUrl: '0x01',
      status: 'pending',
      volunteerName: 'SEND GOOD TO SELF',
      volunteerProfile: '0x0'
    },
    {
      amount: 10,
      currency: 'VHR',
      date: '2022-01-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'pending',
      volunteerName: 'SEND VHR TO SELF',
      volunteerProfile: '0x0'
    },
    {
      amount: 1,
      currency: 'VHR',
      date: '2023-01-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'approved',
      volunteerName: 'TEST',
      volunteerProfile: '0x0'
    },
    {
      amount: 3,
      currency: 'GOOD',
      date: '2025-01-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'approved',
      volunteerName: 'TEST 2',
      volunteerProfile: '0x0'
    },
    {
      amount: 7,
      currency: 'GOOD',
      date: '2026-01-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'rejected',
      volunteerName: 'TEST 3',
      volunteerProfile: '0x0'
    },
    {
      amount: 7,
      currency: 'GOOD',
      date: '2026-01-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'rejected',
      volunteerName: 'TEST 3',
      volunteerProfile: '0x0'
    },
    {
      amount: 8,
      currency: 'VHR',
      date: '2026-03-02',
      hours: 5,
      publicationUrl: '0x01',
      status: 'pending',
      volunteerName: 'TEST 4',
      volunteerProfile: '0x0'
    },
    {
      amount: 12,
      currency: 'VHR',
      date: '2026-01-02',
      hours: 6,
      publicationUrl: '0x01',
      status: 'pending',
      volunteerName: 'A',
      volunteerProfile: '0x0'
    }
  ];

  const [requests, setRequests] = useState<RequestData[]>(initialRequests);

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
      // Approve VHR
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
      // Approve GOOD
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
      console.log('Allowance enabled for GOOD');
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
      let currencyAddress = '' as Address;
      if (request.currency === 'VHR') {
        currencyAddress = allowedTokens.find((token) => token.symbol === 'VHR')
          ?.contractAddress as Address;
      } else if (request.currency === 'GOOD') {
        currencyAddress = allowedTokens.find((token) => token.symbol === 'GOOD')
          ?.contractAddress as Address;
      }

      // Get final rate
      const usdRate =
        fiatRates.find((rate) => rate.address === currencyAddress.toLowerCase())
          ?.fiat || 0;
      const cryptoRate = !usdRate
        ? request.amount
        : Number((request.amount / usdRate).toFixed(2));
      const finalRate = cryptoRate * 10 ** 18;

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
    <div>
      <Card className="space-y-3 p-5">
        <Button onClick={enableSending}>Enable Sending GOOD and VHR</Button>
        <div className="max-h-[calc(5*theme(space.20))] overflow-y-scroll">
          {requests.map((request, index) => (
            <div
              className="mb-1 mt-1 flex w-full items-center justify-between space-x-2 rounded-xl border bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
              id="goodRequest"
              key={index}
              onClick={() => onRequestOpen(request)}
            >
              <span className="flex-[1.5]">{request.volunteerName}</span>
              <span className="flex-[1.5]">
                {request.amount}{' '}
                {request.currency === 'VHR'
                  ? 'VHR'
                  : request.currency === 'GOOD'
                    ? 'GOOD'
                    : null}
              </span>
              <span className="flex-1">{request.hours}h</span>
              <span className="flex-[1.5]">{request.date}</span>
              <span className="flex flex-1 justify-end space-x-2 py-2">
                {request.status === 'pending' ? (
                  <>
                    <Tooltip className="" content="Deny" placement="top">
                      <button
                        className="rounded-full outline-offset-8"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <XCircleIcon className="size-8" />
                      </button>
                    </Tooltip>
                    <Tooltip className="ml-5" content="Accept" placement="top">
                      <button
                        className="rounded-full outline-offset-8"
                        onClick={() => handleSendTokens(request)}
                        style={{ verticalAlign: 'middle' }}
                      >
                        <CheckCircleIcon className="size-8" />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <span className="text-sm font-bold">
                    {request.status.toUpperCase()}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrganizationTable;
