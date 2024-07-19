import type { Donation } from '@components/Donations/DonationPost';
import type { Post } from '@good/lens';
import type { FC } from 'react';

import DonatorCard from '@components/Donations/DonatorCard';
import { EmptyState } from '@good/ui';
import { GiftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface DonationModalProps {
  donations: Donation[];
  onClose: () => void;
  post: Post;
}

const DonationModal: FC<DonationModalProps> = ({
  donations,
  onClose,
  post
}) => {
  // Calculate the total amount donated
  const totalAmountDonated = donations.reduce(
    (total, donation) => total + Number(donation.amount),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Donations</h2>
          <button
            className="rounded-full text-gray-800 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="w-2/3 overflow-y-auto" style={{ maxHeight: '300px' }}>
            {donations.length > 0 ? (
              donations.map((donation) => (
                <DonatorCard donation={donation} key={donation.id} />
              ))
            ) : (
              <EmptyState
                icon={<GiftIcon className="size-8" />}
                message="Be the first one to donate!"
              />
            )}
          </div>
          <div className="flex w-1/3 flex-col justify-between">
            <div className="mb-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Total Amount Donated:{' '}
                <span className="font-semibold text-black dark:text-white">
                  ${totalAmountDonated.toLocaleString()} Tokens
                </span>
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Goal:{' '}
                <span className="font-semibold text-black dark:text-white">
                  $5,000 USD
                </span>
              </p>
            </div>
            <Link
              className="w-full rounded-full bg-pink-500 px-6 py-2 text-center text-white hover:bg-pink-600"
              href={`/donations/${post.id}`}
            >
              Donation Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
