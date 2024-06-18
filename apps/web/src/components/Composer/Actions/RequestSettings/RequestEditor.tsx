import type { FC } from 'react';

import { Card, Tooltip } from '@good/ui';
import { ClockIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
// import { useState } from 'react';
// import plur from 'plur';
import { usePublicationRequestStore } from 'src/store/non-persisted/publication/usePublicationRequestStore';

import RequestForm from './RequestForm';

// Created based on PollSetting's index.tsx, adjust as required
const RequestEditor: FC = () => {
  const {
    // requestConfig,
    resetRequestConfig,
    // setRequestConfig,
    setShowRequestEditor
  } = usePublicationRequestStore();
  // const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-8 py-6" forceRounded>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <ClockIcon className="size-4" />
          <b>Volunteer's GOOD Request</b>
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
      <RequestForm />
    </Card>
  );
};

export default RequestEditor;
