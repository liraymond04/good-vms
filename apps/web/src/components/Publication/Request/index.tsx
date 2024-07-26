import type { Request as TRequest } from '@good/types/good';
import type { FC } from 'react';

import Wrapper from '@components/Shared/Embed/Wrapper';
import { GOOD_API_URL } from '@good/data/constants';
import { Spinner } from '@good/ui';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import RequestCard from './RequestCard';

interface SnapshotProps {
  id: string;
}

const Request: FC<SnapshotProps> = ({ id }) => {
  const getRequest = async (): Promise<null | TRequest> => {
    try {
      const response = await axios.get(`${GOOD_API_URL}/requests/get`, {
        headers: { ...getAuthApiHeaders(), 'X-Skip-Cache': true },
        params: { id }
      });
      const { data } = response;

      return data?.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: getRequest,
    queryKey: ['getRequest', id]
  });

  if (isLoading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.id || error) {
    return null;
  }

  return <RequestCard refetch={refetch} request={data} />;
};

export default Request;
