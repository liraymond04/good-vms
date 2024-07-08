'use client';

import type { Post } from '@good/lens';
import type { FC } from 'react';

import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import { GOOD_API_URL } from '@good/data/constants';
import formatDate from '@good/helpers/datetime/formatDate';
import getAvatar from '@good/helpers/getAvatar';
import getProfile from '@good/helpers/getProfile';
import getPublicationData from '@good/helpers/getPublicationData';
import { Image } from '@good/ui';
import cn from '@good/ui/cn';
import { CurrencyDollarIcon, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

import DonationModal from './DonationModal';

export interface Donation {
  amount: string;
  causeId: string;
  createdAt: Date;
  fromAddress: string;
  fromProfileId: string;
  id: string;
  tokenAddress: string;
  txHash: string;
}

interface DonationPostProps {
  index: number;
  length: number;
  post: Post;
}

async function fetchDonationsOnPost(
  postId: `0x${string}-0x${string}`
): Promise<Donation[]> {
  const [profileId, publicationId] = postId.split('-');

  const { data } = await axios.get(
    `${GOOD_API_URL}/donations/all-donations-on-post`,
    {
      params: {
        profileId: Number(profileId).toString(16),
        publicationId: Number(publicationId).toString(16)
      }
    }
  );

  return data.donations;
}

const DonationPost: FC<DonationPostProps> = ({ index, length, post }) => {
  const [showModal, setShowModal] = useState(false);

  const {
    data: donationsData,
    error,
    isError
  } = useQuery({
    queryFn: () => fetchDonationsOnPost(post.id),
    queryKey: ['donationsOnPost', post.id],
    refetchOnMount: false
  });

  if (isError) {
    console.error(`Failed to fetch donations for post ${post.id}: ${error}`);
  }

  const isFirstInFeed = index === 0;
  const isLastInFeed = index === length - 1;

  const donations = donationsData ?? [];
  const donationsCount = donations.length;

  const profile = getProfile(post.by);

  const publicationData = getPublicationData(post.metadata);
  const postContent = publicationData?.content ?? '';
  const postAttachments = publicationData?.attachments ?? [];
  const postAsset = publicationData?.asset;

  const hasAttachments = postAttachments.length > 0 || !!postAsset;

  return (
    <div
      className={cn(
        isFirstInFeed && 'rounded-t-lg border-t',
        isLastInFeed && 'rounded-b-lg border-b',
        'border-l border-r border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-black'
      )}
    >
      <div className="p-4">
        <div className="mb-4 flex items-start">
          <Image
            alt={profile.displayName}
            className="h-10 w-10 rounded-full"
            height={10}
            src={getAvatar(post.by)}
            width={10}
          />
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{profile.displayName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-100">
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            {/* Post Contents */}
            <Markup className="mt-2 mb-4">{postContent}</Markup>
            {/* Post Attachments/Media */}
            {hasAttachments && (
              <div className="mb-4 h-auto w-full rounded-lg">
                <Attachments asset={postAsset} attachments={postAttachments} />
              </div>
            )}
            <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-100">
              <div
                className="mr-4 flex items-center"
                onClick={() => setShowModal(true)}
              >
                <CurrencyDollarIcon className="mr-1 size-4" />
                {donationsCount} Donations
              </div>
              <div className="mr-4 flex items-center">
                <HandThumbUpIcon className="mr-1 size-4" />
                {post.stats.reactions} likes
              </div>
              <div className="mr-4 flex items-center">
                <ChatBubbleBottomCenterTextIcon className="mr-1 size-4" />
                {post.stats.comments} comments
              </div>
              <div className="flex items-center">
                <ShareIcon className="mr-1 size-4" />
                {post.stats.shares} shares
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Separator between posts */}
      {!isLastInFeed && (
        <div className="bg-white py-6 dark:bg-black">
          <hr className="mx-2 border-gray-300 dark:border-gray-700" />
        </div>
      )}
      {showModal && (
        <DonationModal
          donations={donations}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default DonationPost;
