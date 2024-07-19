import type { Post } from '@good/lens';

import getPublicationData from '@good/helpers/getPublicationData';
import React from 'react';

import Thumbnail from './Thumbnail';

interface DonationThumbnailProps {
  post: Post;
}

const DonationThumbnail: React.FC<DonationThumbnailProps> = ({ post }) => {
  const donationMetadata = getPublicationData(post.metadata);
  const postAttachments = donationMetadata?.attachments ?? [];
  const postAsset = donationMetadata?.asset;

  return (
    <div>
      <div className="max-w-fit text-4xl">
        GoodCast Donations: {post.id}
        <Thumbnail asset={postAsset} attachments={postAttachments} />
      </div>
    </div>
  );
};

export default DonationThumbnail;
