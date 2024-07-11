import type { Profile } from '@good/lens';
import type { FC } from 'react';

import getAvatar from '@good/helpers/getAvatar';
import { Card, Image, Modal } from '@good/ui';
import { Button } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface Donation {
  id: string;
  causeId: string;
  fromProfileId: string;
  fromAddress: string;
  tokenAddress: string;
  amount: string;
  txHash: string;
  createdAt: string;
}

interface DonorsDisplayProps {
  allNewDonors: Donation[];
  allTopDonors: Donation[];
  newDonorProfiles: Profile[];
  topDonorProfiles: Profile[]; 
  top: boolean;
}

const DonorsDisplayCard: FC<DonorsDisplayProps> = ({
  allNewDonors,
  allTopDonors,
  newDonorProfiles,
  topDonorProfiles, 
  top,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'top' | 'new'>(top ? 'top' : 'new');
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!showModal) {
      setSelectedTab(top ? 'top' : 'new');
    }
  }, [showModal, top]);

  const renderSupporters = (donorProfiles: Profile[], donations: Donation[]) => {
    return (
      <div className="overflow-y-scroll max-h-96 scrollbar-w-2 scrollbar-track-gray-300 scrollbar-thumb-gray-500">
        {donorProfiles.map((donorProfile, index) => (
          <div className="supporter-details mb-5 flex flex-col items-center" key={index}>
            <div className="flex items-center">
              <Image
                alt={donorProfile.handle?.localName}
                className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
                src={getAvatar(donorProfile)}
                height={10}
                width={10}
              />
              <div className="ml-4">
                <p>{donorProfile.handle?.localName}</p>
                {donations && donations[index] && <p>${donations[index].amount}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const modalContent = (
    <Card className="rounded-b-xl rounded-t-none border-none">
      <div className="p-4">
        <div className="mb-4 flex justify-center space-x-4">
          <Button
            className={`rounded-full px-4 py-2 text-lg text-white`}
            onClick={() => setSelectedTab('top')}
            style={{
              backgroundColor: selectedTab === 'top' ? '#da5597' : '#808080'
            }}
          >
            Top Donors
          </Button>
          <Button
            className={`rounded-full px-4 py-2 text-lg text-white`}
            onClick={() => setSelectedTab('new')}
            style={{
              backgroundColor: selectedTab === 'new' ? '#da5597' : '#808080'
            }}
          >
            New Donors
          </Button>
        </div>

        {selectedTab === 'top' && <>{renderSupporters(topDonorProfiles, allTopDonors)}</>}
        {selectedTab === 'new' && <>{renderSupporters(newDonorProfiles, allNewDonors)}</>}
      </div>
    </Card>
  );

  return (
    <>
      <Button
        className="rounded-full px-4 py-2 text-lg text-white"
        onClick={handleOpen}
        style={{ background: '#da5597', width: '50%' }}
      >
        Show All
      </Button>
      {showModal && (
        <Modal onClose={handleClose} show={true} title="Donors">
          {modalContent}
        </Modal>
      )}
    </>
  );
};

export default DonorsDisplayCard;
