import { GOOD_API_URL } from '@good/data/constants';
import { getAuthApiHeaders } from '@helpers/getAuthApiHeaders';
import axios from 'axios';
import { useRequestFormDataStore } from 'src/store/non-persisted/publication/useRequestFormDataStore';

type CreateRequestResponse = string;

const useCreateRequest = () => {
  // THIS ONE
  // const { requestParams } = usePublicationRequestStore();
  const { attributes } = useRequestFormDataStore();

  // TODO: use useCallback
  // TO-DO: add request params
  const createRequest = async (): Promise<CreateRequestResponse> => {
    // console.log(attributes);
    // attributes?.forEach(item => {
    //   console.log(item);
    //   console.log(item.traitType, item.value);
    // })
    // console.log(attributes && attributes[0]?.traitType, attributes && attributes[0]?.value);
    const response = await axios.post(
      `${GOOD_API_URL}/requests/create`,
      {
        description: attributes && attributes[0]?.value,
        donationAmount:
          (attributes && parseFloat(attributes[1]?.value ?? '0')) || 0,
        donorProfileID: attributes && attributes[2]?.value,
        evidenceURL: attributes && attributes[3]?.value,
        organizationName: attributes && attributes[4]?.value,
        projectURL: attributes && attributes[5]?.value,
        transactionURL: attributes && attributes[6]?.value,
        volunteerHours:
          (attributes && parseFloat(attributes[7]?.value ?? '0')) || 0
      },
      { headers: getAuthApiHeaders() }
    );

    return response.data.request.id;
  };

  return createRequest;
};

export default useCreateRequest;
