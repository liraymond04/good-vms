import { FC, useState, useEffect } from 'react';
import { Modal, Card } from '@good/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import type { Profile } from '@good/lens';
import getAvatar from '@good/helpers/getAvatar';
import { Button } from '@headlessui/react';
import { Image } from '@good/ui';

interface DonorsDisplayProps {
  allNewDonors: { amount: number; supporter: Profile }[];
  allTopDonors: { amount: number; supporter: Profile }[];
  top: boolean;
}

const DonorsDisplayCard: FC<DonorsDisplayProps> = ({ allNewDonors, allTopDonors, top }) => {
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

  const renderSupporters = (donors: { amount: number; supporter: Profile }[]) => {
    return (
      <div className="overflow-y-scroll max-h-96 scrollbar-w-2 scrollbar-track-gray-300 scrollbar-thumb-gray-500">
        {donors.map((donor, index) => (
          <div className="supporter-details mb-5 flex flex-col items-center" key={index}>
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
        ))}
      </div>
    );
  };

  const modalContent = (
    <Card className="rounded-b-xl rounded-t-none border-none">
      <div className="p-4">
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            style={{ backgroundColor: selectedTab === 'top' ? '#da5597' : '' }}
            className={`rounded-full px-4 py-2 text-lg text-white`}
            onClick={() => setSelectedTab('top')}
          >
            Top Donors
          </Button>
          <Button
            style={{ backgroundColor: selectedTab === 'new' ? '#da5597' : '' }}
            className={`rounded-full px-4 py-2 text-lg text-white`}
            onClick={() => setSelectedTab('new')}
          >
            New Donors
          </Button>
        </div>

        {selectedTab === 'top' && <>{renderSupporters(allTopDonors)}</>}
        {selectedTab === 'new' && <>{renderSupporters(allNewDonors)}</>}
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
        <Modal show={true} onClose={handleClose} title="Donors">
          {modalContent}
        </Modal>
      )}
    </>
  );
};

export default DonorsDisplayCard;
