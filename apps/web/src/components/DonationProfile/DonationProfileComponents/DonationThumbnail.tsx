import React from 'react';
import styled from 'styled-components';
import { Post, Image as LensImage } from '@good/lens';
import getPublicationData from '@good/helpers/getPublicationData';
import Thumbnail from './Thumbnail';

interface DonationThumbnailProps {
  post: Post;
}



const PlaceholderImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: #ddd;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;

const DonationThumbnail: React.FC<DonationThumbnailProps> = ({
  post
}) => {


  const donationMetadata = getPublicationData(post.metadata);
  const postContent = donationMetadata?.content ?? '';
  const postAttachments = donationMetadata?.attachments ?? [];
  const postAsset = donationMetadata?.asset;

  const hasAttachments = postAttachments.length > 0 || !!postAsset;

  return (
    <div>
      <div className="text-4xl  max-w-fit  ">GoodCast Donations: {post.id}
      <Thumbnail asset={postAsset} attachments={postAttachments} />
      </div>
    </div>
  );
};

export default DonationThumbnail;
