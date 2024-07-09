import type { Profile } from '@good/lens';

import getAvatar from '@good/helpers/getAvatar';
import { Image } from '@good/ui';
import React, { useState } from 'react';

import DonorsDisplayCard from '../Cards/DonorDisplayCard';

interface DonorsProps {
  newDonors: { amount: number; supporter: Profile }[];
  topDonors: { amount: number; supporter: Profile }[];
}

const Donors: React.FC<DonorsProps> = ({ newDonors, topDonors }) => {
  const [showAllTopDonors, setShowAllTopDonors] = useState(false);
  const [showAllNewDonors, setShowAllNewDonors] = useState(false);

  const handleShowAllTopDonors = () => {
    setShowAllTopDonors(true);
  };

  const handleShowAllNewDonors = () => {
    setShowAllNewDonors(true);
  };

  const renderSupporters = (
    donors: { amount: number; supporter: Profile }[],
    showAll: boolean
  ) => {
    const displayedDonors = showAll ? donors : donors.slice(0, 5);

    return displayedDonors.map((donor, index) => (
      <div
        className="supporter-details mb-5 flex flex-col items-center"
        key={index}
      >
        <div className="flex items-center">
          <Image
            alt={donor.supporter.id}
            className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
            src={getAvatar(donor.supporter)}
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
    <div className="-top-10 items-center justify-center rounded">
      <div className="flex justify-center">
        <div className="w-1/2 pr-4">
          <div className="mb-5 text-lg">
            <h3 className="text-center">Top Donors</h3>
          </div>
          <div className="flex flex-col items-center">
            {renderSupporters(topDonors, showAllTopDonors)}
            <div className="mt-5 w-full text-center">
              <DonorsDisplayCard
                allNewDonors={newDonors}
                allTopDonors={topDonors}
                top={true}
              />
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
              <DonorsDisplayCard
                allNewDonors={newDonors}
                allTopDonors={topDonors}
                top={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donors;
