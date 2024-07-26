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
  requestData: AnyPublication | RequestData;
}

// Type guard function to check if requestData is of type AnyPublication
function isAnyPublication(data: any): data is AnyPublication {
  return (
    data && typeof data.id === 'string' && typeof data.createdAt === 'string'
  );
}

const RequestListing = ({
  onClose,
  open,
  requestData
}: RequestListingProps) => {
  if (!open || !isAnyPublication(requestData)) {
    return null;
  }

  return (
    <div className="relative mt-4">
      <Card className="relative rounded-lg bg-white p-6 shadow-lg">
        <button
          aria-label="Close"
          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <div className="flex justify-between">
          <div className="mr-8">
            <div className="mb-2 flex items-start">
              <div>
                <div className="text-lg font-medium">
                  {requestData.by.handle?.localName}
                </div>
                <div className="flex gap-1">
                  <LinkIcon className="h-5 w-5 text-black dark:text-white" />
                  <div className="text-blue-500 hover:underline">
                    <a href={requestData.id}>{requestData.id}</a>
                  </div>
                </div>
                <div className="mt-2">
                  <div>Publication URL</div>
                  <div className="flex gap-1">
                    <LinkIcon className="h-5 w-5 text-black dark:text-white" />
                    <div className="text-blue-500 hover:underline">
                      <a href={requestData.id}>{requestData.id}</a>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Request made on{' '}
                  {new Date(requestData.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-8 flex-1">
            <div className="mb-4 flex">
              <div className="text-xl font-bold">amount</div>
              <div className="ml-4 text-xl font-bold">hours</div>
            </div>
            <div className="text-md max-w-full break-words">
              Placeholder description
            </div>
            <div className="text-md mt-4">Status: Placeholder</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RequestListing;
