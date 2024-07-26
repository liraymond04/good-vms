import type {
  AnyPublication,
  Comment,
  Post,
  PublicationsRequest,
  Quote
} from '@good/lens';
import type { FC } from 'react';
import type { StateSnapshot, VirtuosoHandle } from 'react-virtuoso';

import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { GoodOrganizationStore } from '@good/abis';
import { GOOD_ORGANIZATION_STORE } from '@good/data/constants';
import {
  PublicationMetadataMainFocusType,
  PublicationType,
  usePublicationsQuery
} from '@good/lens';
import { Button, Card } from '@good/ui';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ProfileFeedType } from 'src/enums';
import { useProfileFeedStore } from 'src/store/non-persisted/useProfileFeedStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import { useAccount, useReadContract } from 'wagmi';

import OrganizationListing from './OrganizationListing';
import OrganizationTable from './OrganizationTable';
import RequestListing from './RequestListing';
import RequestPrototype from './RequestPrototype';
import RequestTable from './RequestTable';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface RequestProps {
  handle: string;
  profileDetailsLoading: boolean;
  profileId: null | string;
  type:
    | ProfileFeedType.Collects
    | ProfileFeedType.Feed
    | ProfileFeedType.Media
    | ProfileFeedType.Replies
    | ProfileFeedType.Requests;
}
interface RequestData {
  amount: number;
  currency: string;
  date: string;
  hours: number;
  publicationUrl: string;
  status: string;
  volunteerName: string;
  volunteerProfile: string;
}
const Requests: FC<RequestProps> = ({
  handle,
  profileDetailsLoading,
  profileId,
  type
}) => {
  const { currentProfile } = useProfileStore();
  const { mediaFeedFilters } = useProfileFeedStore();
  const { indexedPostHash } = useTransactionStore();
  const { address } = useAccount();
  const virtuoso = useRef<VirtuosoHandle>(null);

  const [sortBy, setSortBy] = useState('Name');
  const [filterBy, setFilterBy] = useState('All');
  const [filteredPublications, setFilteredPublications] = useState<
    (Comment | Post | Quote)[]
  >([]);
  const [showRequest, setShowRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<
    AnyPublication | null | RequestData
  >(null);

  const getMediaFilters = () => {
    const filters: PublicationMetadataMainFocusType[] = [];
    if (mediaFeedFilters.images) {
      filters.push(PublicationMetadataMainFocusType.Image);
    }
    if (mediaFeedFilters.video) {
      filters.push(PublicationMetadataMainFocusType.Video);
    }
    if (mediaFeedFilters.audio) {
      filters.push(PublicationMetadataMainFocusType.Audio);
    }
    return filters;
  };
  const {
    data: accountData,
    error,
    isError,
    isLoading
  } = useReadContract({
    abi: GoodOrganizationStore,
    address: GOOD_ORGANIZATION_STORE,
    args: [address!],
    functionName: 'isOrganization',
    query: {
      enabled: !!address,
      staleTime: 1 * 60 * 1000
    }
  });

  if (isError) {
    toast.error(`Failed to retrieve verified organization status.`);
    console.error(`Failed to retrieve verified organization status: ${error}`);
  }
  const isVerifiedOrganization = !!accountData;

  const publicationTypes: PublicationType[] =
    type === ProfileFeedType.Feed
      ? [PublicationType.Post, PublicationType.Mirror, PublicationType.Quote]
      : type === ProfileFeedType.Replies
        ? [PublicationType.Comment]
        : type === ProfileFeedType.Media
          ? [
              PublicationType.Post,
              PublicationType.Comment,
              PublicationType.Quote
            ]
          : [
              PublicationType.Post,
              PublicationType.Comment,
              PublicationType.Mirror
            ];
  const metadata =
    type === ProfileFeedType.Media
      ? { mainContentFocus: getMediaFilters() }
      : null;
  const request: PublicationsRequest = {
    where: {
      metadata,
      publicationTypes,
      ...(type !== ProfileFeedType.Collects
        ? { from: [profileId] }
        : { actedBy: profileId })
    }
  };
  const {
    data,
    error: exploreError,
    fetchMore,
    loading,
    refetch
  } = usePublicationsQuery({
    variables: { request }
  });

  const retrievedPublications =
    (data?.publications?.items as AnyPublication[]) ?? [];

  const filterPubs = () => {
    // TODO: update these with the actual filter functions based on Good or VHR metadata
    if (filterBy === 'All') {
      setFilteredPublications(
        retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (
          | Comment
          | Post
          | Quote
        )[]
      );
    } else if (filterBy === 'Good') {
      setFilteredPublications(
        retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (
          | Comment
          | Post
          | Quote
        )[]
      );
    } else {
      // (filterBy === "VHR")
      setFilteredPublications(
        retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (
          | Comment
          | Post
          | Quote
        )[]
      );
    }
  };

  function sortPubsName(
    arr: (Comment | Post | Quote)[]
  ): (Comment | Post | Quote)[] {
    if (arr.length <= 1) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(
      (pub) => pub.metadata?.content < pivot.metadata.content
    );
    const middle = arr.filter(
      (pub) => pub.metadata?.content === pivot.metadata.content
    );
    const right = arr.filter(
      (pub) => pub.metadata?.content > pivot.metadata.content
    );

    return [...sortPubsName(left), ...middle, ...sortPubsName(right)];
  }

  function sortPubsAmount(
    arr: (Comment | Post | Quote)[]
  ): (Comment | Post | Quote)[] {
    if (arr.length <= 1) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(
      (pub) => pub.metadata?.content < pivot.metadata.content
    );
    const middle = arr.filter(
      (pub) => pub.metadata?.content === pivot.metadata.content
    );
    const right = arr.filter(
      (pub) => pub.metadata?.content > pivot.metadata.content
    );

    return [...sortPubsAmount(left), ...middle, ...sortPubsAmount(right)];
  }

  // Set initial state of publications to a filtered version of the retrieved data
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
    filterPubs();
  }, [profileId, handle]);

  useEffect(() => {
    if (indexedPostHash && currentProfile?.id === profileId) {
      refetch();
    }
  }, [indexedPostHash]);

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    const { data } = await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
    const ids =
      data?.publications?.items?.map((p) => {
        return p.__typename === 'Mirror' ? p.mirrorOn?.id : p.id;
      }) || [];
  };

  if (loading || profileDetailsLoading) {
    return <PublicationsShimmer />;
  }

  const sortPubs = () => {
    // Publications should already be sorted at this point
    const arr = filteredPublications as (Comment | Post | Quote)[];

    if (sortBy === 'Name') {
      setFilteredPublications(sortPubsName(arr));
    } else {
      setFilteredPublications(sortPubsAmount(arr));
    }
  };
  const onRequestOpen = (publication: AnyPublication) => {
    setSelectedRequest(publication);
    setShowRequest(true);
  };
  const onRequestOpenOrg = (publication: RequestData) => {
    setSelectedRequest(publication);
    setShowRequest(true);
  };

  const onRequestClose = () => {
    setShowRequest(false);
  };

  // Function for getting request data
  // const getRequest = async (): Promise<null | TRequest> => {
  //   if (filteredPublications.length == 0) {
  //     return null;
  //   }

  //   const requestId = getPublicationAttribute(
  //     filteredPublications[0]?.metadata?.attributes,
  //     KNOWN_ATTRIBUTES.REQUEST_ID
  //   );

  //   try {
  //     const response = await axios.get(`${GOOD_API_URL}/requests/get`, {
  //       headers: { ...getAuthApiHeaders(), 'X-Skip-Cache': true },
  //       params: { requestId }
  //     });
  //     const { data } = response;

  //     console.log(data?.result)
  //     return data?.result;
  //   } catch {
  //     console.log("An error occurred while fetching request data")
  //     return null;
  //   }
  // };
  return (
    <Card className="space-y-3 p-5">
      {/* Replace the "false" below with the attribute that tells us 
          whether the user is a volunteer or organization.
          E.g. currentProfile?.metadata?.attributes?[index of volunteer/organization] */}

      {/* {filteredPublications.length != 0 ? <Button onClick={() => getRequest()}>
          Try getting data for first request in table
        </Button> : null} */}

      <div> {false ? 'Incoming Requests' : 'Outgoing Requests'}: </div>

      <div style={{ display: 'flex', gap: '6rem' }}>
        <span>
          <label htmlFor="sortBy">Sort By: </label>
          <select
            className="rounded-xl"
            id="sortBy"
            name="sortBy"
            onChange={(event) => {
              setSortBy(event.target.value);
              sortPubs();
            }}
          >
            <option selected value="Name">
              Name
            </option>
            <option value="Amount">Amount</option>
          </select>
        </span>
        <span>
          <label htmlFor="filterBy">Filter By: </label>
          <select
            className="rounded-xl"
            id="filterBy"
            name="filterBy"
            onChange={(event) => {
              setFilterBy(event.target.value);
              filterPubs();
            }}
          >
            <option selected>All</option>
            <option>Good</option>
            <option>VHR</option>
          </select>
          {filteredPublications.length == 0 ? (
            <Button onClick={filterPubs}>Load Requests</Button>
          ) : null}
        </span>
      </div>
      {!isVerifiedOrganization ? (
        <RequestTable
          onRequestClose={onRequestClose}
          onRequestOpen={onRequestOpen}
          publications={filteredPublications}
          selectedRequest={selectedRequest}
          showRequest={showRequest}
        />
      ) : (
        <OrganizationTable
          onRequestClose={onRequestClose}
          onRequestOpen={onRequestOpenOrg}
          publications={filteredPublications}
          selectedRequest={selectedRequest}
          showRequest={showRequest}
        />
      )}
      <div>
        {selectedRequest && !isVerifiedOrganization ? (
          <RequestListing
            onClose={onRequestClose}
            open={showRequest}
            requestData={selectedRequest}
          />
        ) : (
          <OrganizationListing
            onClose={onRequestClose}
            open={showRequest}
            requestData={selectedRequest}
          />
        )}
        <div>Prototype for Incoming Requests:</div>
        <RequestPrototype />
      </div>
    </Card>
  );
};

export default Requests;
