import React from 'react';
import styled from 'styled-components';
import { Image as LensImage } from '@good/lens'; 

interface DonationThumbnailProps {
  title?: string;
  missionThumbnail?: LensImage | string;
}

const ThumbnailContainer = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 275px; 
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  border: 2px solid white;

`;

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

const DonationThumbnail: React.FC<DonationThumbnailProps> = ({ title, missionThumbnail }) => {
  const imageUrl = typeof missionThumbnail === 'string' ? missionThumbnail : missionThumbnail?.uri || '';

  return (
    <div className="rounded items-center justify-center -top-10">
      <div className="items-left justify-start text-4xl">
        {title}
      </div>
      {imageUrl ? (
        <ThumbnailContainer imageUrl={imageUrl} />
      ) : (
        <PlaceholderImage>
          {title || "No Image Available"}
        </PlaceholderImage>
      )}
    </div>
  );
};

export default DonationThumbnail;
