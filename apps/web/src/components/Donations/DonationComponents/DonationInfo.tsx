import React from 'react';
import styled from 'styled-components';
import { Image as LensImage, Profile } from '@good/lens'; 
import { Image } from '@good/ui';
import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';

interface DonationInfoProps {
  organizer?: Profile | null;
  mission: string;
  update: string;
  updateImages?: (LensImage | string)[];
  updateDate?: Date
}

const DonationInfoContainer = styled.div`
  margin-bottom: 20px; 
`;

const DonationInfo: React.FC<DonationInfoProps> = ({organizer, mission, update, updateImages, updateDate }) => {
  const formatMission = (mission: string) => {
    return mission.replace(/\. /g, '.');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const Avatar = () => (
    <Image
      alt={organizer?.id}
      className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(organizer?.id);
      }}
      src={getAvatar(organizer as Profile)}
    />
  );

  return (
    <DonationInfoContainer className="items-center justify-center">
      <div className="missionText">
      <div className="flex text-lg mb-3 text-gray-500 dark:text-white">
        <Avatar />
        <span className="ml-5 m-auto text-center">
          {organizer?.handle?.localName} is organizing this fundraiser
        </span>
      </div>

        <div className="text-lg mb-3 text-gray-500 dark:text-white">
          Mission:
        </div>
        <div className="mb-3" dangerouslySetInnerHTML={{ __html: formatMission(mission) }} />
      </div>

      <div className="updatesContainer">
        <div className="updatesText mb-5">
          <div className="text-lg mb-3 text-gray-500 dark:text-white">
            Updates:
          </div>
          {updateDate && (
            <div className="mb-3">
              {formatDate(updateDate)}
            </div>
          )}
          <div>
            {update}
          </div>
        </div>
        {updateImages && updateImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {updateImages.map((image, index) => (
            <img
              key={index}
              src={typeof image === 'string' ? image : image.uri}
              alt={`Image ${index + 1}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      )}
      </div>


    </DonationInfoContainer>
  );
};

export default DonationInfo;
