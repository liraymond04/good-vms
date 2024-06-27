import React, { useState } from 'react';
import styled from 'styled-components';
import { Profile } from '@good/lens';
import { Image } from '@good/ui';
import { Button } from '@headlessui/react';
import getAvatar from '@good/helpers/getAvatar';

interface DonorsProps {
  topDonors: { supporter: Profile; amount: number }[];
  newDonors: { supporter: Profile; amount: number }[];
}

const Donors: React.FC<DonorsProps> = ({ topDonors, newDonors }) => {
  const [showAllTopDonors, setShowAllTopDonors] = useState(false);
  const [showAllNewDonors, setShowAllNewDonors] = useState(false);

  const handleShowAllTopDonors = () => {
    setShowAllTopDonors(true);
  };

  const handleShowAllNewDonors = () => {
    setShowAllNewDonors(true);
  };

  const renderSupporters = (donors: { supporter: Profile; amount: number }[], showAll: boolean) => {
    const displayedDonors = showAll ? donors : donors.slice(0, 5);

    return displayedDonors.map((donor, index) => (
      <div key={index} className="supporter-details flex flex-col mb-5 items-center">
        <div className="flex items-center">
          <Image
            src={getAvatar(donor.supporter)}
            alt={donor.supporter.id}
            className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
          />
          <div className="ml-4">
            <p>{donor.supporter?.handle?.localName}</p>
            <p>${donor.amount}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="rounded items-center justify-center -top-10">
      <div className="flex justify-center">
        <div className="w-1/2 pr-4">
          <div className="mb-5 text-lg">
            <h3 className="text-center">Top Donors</h3>
          </div>
          <div className="flex flex-col items-center">
            {renderSupporters(topDonors, showAllTopDonors)}
              <div className="mt-5 w-full">
                <Button
                  style={{ background: '#da5597' }}
                  className="w-1/2 rounded-full py-2 px-4 text-lg text-white"
                  onClick={handleShowAllTopDonors}
                >
                  Show All
                </Button>
              </div>
            
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <div className="mb-5 text-lg">
            <h3 className="text-center">New Donors</h3>
          </div>
          <div className="flex flex-col items-center">
            {renderSupporters(newDonors, showAllNewDonors)}
          
              <div className="mt-5 w-full text-center">
                <Button
                  style={{ background: '#da5597' }}
                  className="w-1/2 rounded-full py-2 px-4 text-lg text-white"
                  onClick={handleShowAllNewDonors}
                >
                  Show All
                </Button>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donors;
