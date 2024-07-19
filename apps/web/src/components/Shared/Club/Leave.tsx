import type { FC } from 'react';

import { GOOD_API_URL } from '@good/data/constants';
import { Button } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { getAuthApiHeadersWithAccessToken } from '@helpers/getAuthApiHeaders';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface LeaveProps {
  id: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Leave: FC<LeaveProps> = ({ id, setJoined, small }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${GOOD_API_URL}/clubs/leave`,
        { id },
        { headers: getAuthApiHeadersWithAccessToken() }
      );

      toast.success('Left club successfully!');
      setJoined(false);
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Joined"
      disabled={isLoading}
      onClick={handleLeave}
      outline
      size={small ? 'sm' : 'md'}
    >
      Joined
    </Button>
  );
};

export default Leave;
