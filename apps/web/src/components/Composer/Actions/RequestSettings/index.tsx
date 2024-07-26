import type { FC } from 'react';

import { Tooltip } from '@good/ui';
import { motion } from 'framer-motion';
import { usePublicationRequestStore } from 'src/store/non-persisted/publication/usePublicationRequestStore';

const RequestSettings: FC = () => {
  const { resetRequestParams, setShowRequestEditor, showRequestEditor } =
    usePublicationRequestStore();

  return (
    <Tooltip content="Request GOOD" placement="top">
      <motion.button
        aria-label="Request GOOD"
        className="rounded-full outline-offset-8"
        onClick={() => {
          resetRequestParams();
          setShowRequestEditor(!showRequestEditor);
        }}
        type="button"
        whileTap={{ scale: 0.9 }}
      >
        {/* streamline:give-gift */}
        <svg
          height="1em"
          viewBox="0 0 14 14"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M13.5 2.5h-7v5h7zm-3.5 0v5M8.5.5l1.5 2l1.5-2M.5 11l2.444 2.036a2 2 0 0 0 1.28.463h6.442c.46 0 .834-.373.834-.833c0-.92-.746-1.667-1.667-1.667H5.354" />
            <path d="m3.5 10l.75.75a1.06 1.06 0 0 0 1.5-1.5L4.586 8.085A2 2 0 0 0 3.17 7.5H.5" />
          </g>
        </svg>
      </motion.button>
    </Tooltip>
  );
};

export default RequestSettings;
