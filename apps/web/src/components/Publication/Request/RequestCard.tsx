import { GOOD_API_URL } from '@good/data/constants';
import { Errors } from '@good/data/errors';
import { Button, Card } from '@good/ui';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import axios from 'axios';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import GiveGiftIcon from './GiveGiftIcon';

interface RequestFormProps {
  refetch?: () => void;
  request: any;
}

const RequestCard: React.FC<RequestFormProps> = ({ refetch, request }) => {
  // Implement your component logic here
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();
  let requestId = request.id;

  const approveRequest = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    // TO-DO: add processPublicationAction

    // Sets to approved
    await axios.post(
      `${GOOD_API_URL}/requests/act`,
      { requestId, statusChange: 'APPROVED' },
      { headers: getAuthApiHeaders() }
    );
    refetch?.();
  };

  const rejectRequest = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    // TO-DO: add processPublicationAction

    // Sets to rejected
    await axios.post(
      `${GOOD_API_URL}/requests/act`,
      { requestId, statusChange: 'REJECTED' },
      { headers: getAuthApiHeaders() }
    );
    refetch?.();
  };

  return (
    <Card className="mx-auto mt-3">
      <div className="">
        <div className="flex items-center space-x-2 px-6 py-4">
          <GiveGiftIcon />
          <b>Volunteer's GOOD Request</b>
        </div>
      </div>
      {/* display request data */}
      <div className="px-6 pb-4">
        {request.organizationName && (
          <div className="mb-4">
            <b>Organization Name:</b> <br />@{request.organizationName}
          </div>
        )}
        {request.donorProfileID && (
          <div className="mb-4">
            <b>Donor's Profile ID:</b> <br />@{request.donorProfileID}
          </div>
        )}
        {request.donationAmount != 0 && (
          <div className="mb-4">
            <b>Donation Amount</b> <br />${request.donationAmount}
          </div>
        )}
        {request.projectURL && (
          <div className="mb-4">
            <b>Project or Cause URL</b> <br />
            <a href={request.projectURL}>{request.projectURL}</a>
          </div>
        )}
        {request.transactionURL && (
          <div className="mb-4">
            <b>Donation Transaction URL</b> <br />
            <a href={request.transactionURL}>{request.transactionURL}</a>
          </div>
        )}

        {request.volunteerHours != 0 && (
          <div className="mb-4">
            <b>Volunteer Hours</b> <br />
            {request.volunteerHours} hours
          </div>
        )}

        {request.evidenceURL && (
          <div className="mb-4">
            <b>Evidence of Volunteer Activities URL</b> <br />
            <a href={request.evidencetURL}>{request.evidenceURL}</a>
          </div>
        )}
        {request.description && (
          <div>
            <b>Description</b> <br />
            {request.description}
          </div>
        )}
        {/* only display if status is SUBMITTED or INREVIEW */}
        {(request.status === 'SUBMITTED' || request.status === 'INREVIEW') && (
          <div className="mt-4 flex justify-end">
            <Button className="mr-2" onClick={rejectRequest} variant="danger">
              Reject
            </Button>
            <Button onClick={approveRequest}>Approve</Button>
          </div>
        )}
        {/* status indicator*/}
        {request.status === 'REJECTED' && (
          <div className="flex justify-end p-4 font-bold text-red-500">
            Request was rejected.
          </div>
        )}
        {request.status === 'INREVIEW' && (
          <div className="flex justify-end p-4 font-bold text-yellow-500">
            Request is In Review.
          </div>
        )}
        {request.status === 'APPROVED' && (
          <div className="flex justify-end p-4 font-bold text-green-500">
            Request Approved!
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestCard;
