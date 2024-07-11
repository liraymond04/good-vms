import type { FC } from 'react';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';


interface DonateProps {
}

const DonateCard: FC<DonateProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();

  const handleOpen = () => {
    setShowModal(true);
  }

  const handleClose = () => {
    setShowModal(false);
  }

  return (
    <button 
    className="w-full rounded-full px-4 mb-3 mt-3 py-2 text-sm text-white" 
    style={{ background: '#da5597' }}
    onClick={handleOpen}>
      <span>Donate</span>
    </button>
  );
};

export default DonateCard;
