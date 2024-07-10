import type { FC } from 'react';

import { GOOD_API_URL } from '@good/data/constants';
import { Button } from '@good/ui';
import errorToast from '@helpers/errorToast';
import { getAuthApiHeadersWithAccessToken } from '@helpers/getAuthApiHeaders';
import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface JoinProps {
  id: string;
  setJoined: (joined: boolean) => void;
  small: boolean;
}

const Join: FC<JoinProps> = ({ id, setJoined, small }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${GOOD_API_URL}/clubs/join`,
        { id },
        { headers: getAuthApiHeadersWithAccessToken() }
      );

      toast.success('Joined club successfully!');
      setJoined(true);
    } catch (error) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      aria-label="Join"
      disabled={isLoading}
      onClick={handleJoin}
      outline
      size={small ? 'sm' : 'md'}
    >
      Join
    </Button>
  );
};

export default Join;
