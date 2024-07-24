import type { AnyPublication } from '@good/lens';

import { Card } from '@good/ui';
import { LinkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

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

interface RequestListingProps {
  onClose: () => void;
  open: boolean;
  requestData: AnyPublication | null | RequestData;
}

function isRequestData(data: any): data is RequestData {
  return (
    data &&
    typeof data.amount === 'number' &&
    typeof data.currency === 'string' &&
    typeof data.date === 'string' &&
    typeof data.hours === 'number' &&
    typeof data.publicationUrl === 'string' &&
    typeof data.status === 'string' &&
    typeof data.volunteerName === 'string' &&
    typeof data.volunteerProfile === 'string'
  );
}

const RequestListing = ({
  onClose,
  open,
  requestData
}: RequestListingProps) => {
  if (!open || !isRequestData(requestData)) {
    return null;
  }

  return (
    <div className="mt-4">
      <Card className="rounded-lg bg-white p-6 shadow-lg">
        <button
          aria-label="Close"
          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <div className="flex justify-between">
          <div>
            <div className="mb-2 flex items-start">
              <div>
                <div className="text-lg font-medium">
                  {requestData.volunteerName}
                </div>
                <div className="flex gap-1">
                  <LinkIcon className="h-5 w-5 text-black dark:text-white" />
                  <div className="text-blue-500 hover:underline">
                    <a href={requestData.volunteerProfile}>
                      {requestData.volunteerProfile}
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <div>Publication URL</div>
                  <div className="flex gap-1">
                    <LinkIcon className="h-5 w-5 text-black dark:text-white" />
                    <div className="text-blue-500 hover:underline">
                      <a href={requestData.publicationUrl}>
                        {requestData.publicationUrl}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <div className="text-xl font-bold">
                    {requestData.amount} {requestData.currency}
                  </div>
                  <div className="ml-4 text-xl font-bold">
                    {requestData.hours} hours
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Request made on {requestData.date}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-6 flex-1">
            <div className="text-sm">
              {requestData.volunteerName} is requesting {requestData.amount} in{' '}
              {requestData.currency}. They volunteered {requestData.hours} hours
              for{' '}
              <a
                className="text-blue-500 hover:underline"
                href={requestData.publicationUrl}
              >
                {requestData.publicationUrl}
              </a>
              .
            </div>
            <div className="mt-2 text-sm">
              Their uploaded proof of volunteer activities is:{' '}
              <a
                className="text-blue-500 hover:underline"
                href="imgur.com/123456abc"
              >
                imgur.com/123456abc
              </a>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {requestData.status === 'pending' ? (
                <>
                  <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
                    Reject
                  </button>
                  <button className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                    Accept
                  </button>
                </>
              ) : (
                <div>
                  STATUS:&nbsp;
                  <span
                    className={
                      requestData.status === 'approved'
                        ? 'text-green-500'
                        : requestData.status === 'rejected'
                          ? 'text-red-500'
                          : ''
                    }
                  >
                    {requestData.status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RequestListing;
