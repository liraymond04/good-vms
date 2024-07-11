import type { FC } from 'react';

import { useState } from 'react';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface DonateProps {}

const DonateCard: FC<DonateProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <button
      className="mb-3 mt-3 w-full rounded-full px-4 py-2 text-sm text-white"
      onClick={handleOpen}
      style={{ background: '#da5597' }}
    >
      <span>Donate</span>
    </button>
  );
};

export default DonateCard;
