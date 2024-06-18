import type { FC } from 'react';

import { Button, Card, Input, Modal, Tooltip } from '@good/ui';
import { ClockIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3BottomLeftIcon, XCircleIcon } from '@heroicons/react/24/solid';
import plur from 'plur';
import { useState } from 'react';
import { usePublicationRequestStore } from 'src/store/non-persisted/publication/usePublicationRequestStore';

// Created based on PollSetting's index.tsx, adjust as required
const RequestEditor: FC = () => {
  const {
    requestConfig,
    resetRequestConfig,
    setRequestConfig,
    setShowRequestEditor
  } = usePublicationRequestStore();
  // const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <ClockIcon className="size-4" />
          <b>Claim GOOD</b>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip content="Delete" placement="top">
            <button
              className="flex"
              onClick={() => {
                resetRequestConfig();
                setShowRequestEditor(false);
              }}
              type="button"
            >
              <XCircleIcon className="size-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">PLACEHOLDER FOR CLAIM GOOD FORM</div>
    </Card>
  );
};

export default RequestEditor;
