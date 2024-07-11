import React from 'react';
import { Post, Image as LensImage } from '@good/lens';
import getPublicationData from '@good/helpers/getPublicationData';
import Thumbnail from './Thumbnail';

interface DonationThumbnailProps {
  post: Post;
}

const DonationThumbnail: React.FC<DonationThumbnailProps> = ({
  post
}) => {


  const donationMetadata = getPublicationData(post.metadata);
  const postAttachments = donationMetadata?.attachments ?? [];
  const postAsset = donationMetadata?.asset;


  return (
    <div>
      <div className="text-4xl  max-w-fit  ">GoodCast Donations: {post.id}
      <Thumbnail asset={postAsset} attachments={postAttachments} />
      </div>
    </div>
  );
};

export default DonationThumbnail;
