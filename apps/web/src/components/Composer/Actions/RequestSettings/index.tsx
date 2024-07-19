import type { FC } from 'react';

import { Tooltip } from '@good/ui';
// import { GiftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { usePublicationRequestStore } from 'src/store/non-persisted/publication/usePublicationRequestStore';

import GiveGiftIcon from './GiveGiftIcon';

const RequestSettings: FC = () => {
  const { resetRequestConfig, setShowRequestEditor, showRequestEditor } =
    usePublicationRequestStore();

  return (
    <Tooltip content="Request GOOD" placement="top">
      <motion.button
        aria-label="Request GOOD"
        className="rounded-full outline-offset-8"
        onClick={() => {
          resetRequestConfig();
          setShowRequestEditor(!showRequestEditor);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        <GiveGiftIcon />
      </motion.button>
    </Tooltip>
  );
};

export default RequestSettings;
