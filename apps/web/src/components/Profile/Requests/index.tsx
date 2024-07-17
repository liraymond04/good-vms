import { Card } from '@good/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React, { FC, useEffect, useRef, useState } from 'react';
import { PublicationMetadataMainFocusType, Profile, PublicationsRequest, AnyPublication, Post, Quote, Comment, Mirror} from '@good/lens';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useProfileFeedStore } from 'src/store/non-persisted/useProfileFeedStore';
import { StateSnapshot, Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import RequestTable from './RequestTable';
import { usePublicationsQuery, PublicationType } from '@good/lens'
// import GoodAction from './GoodAction';
// import VHRAction from './VHRAction';
import { ProfileFeedType } from 'src/enums';
import { useTransactionStore } from 'src/store/persisted/useTransactionStore';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface RequestProps {
  handle: string;
  profileDetailsLoading: boolean;
  profileId: string;
  type:
    | ProfileFeedType.Collects
    | ProfileFeedType.Feed
    | ProfileFeedType.Media
    | ProfileFeedType.Replies
    | ProfileFeedType.Requests;
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
  const virtuoso = useRef<VirtuosoHandle>(null);
  
  const [sortBy, setSortBy] = useState("Name");
  const [filterBy, setFilterBy] = useState("All");
  const [filteredPublications, setFilteredPublications] = useState<AnyPublication[]>([]);
  
  useEffect(() => {
    virtuosoState = { ranges: [], screenTop: 0 };
    filterPubs()
  }, [profileId, handle]);

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
  const { data, error: exploreError, fetchMore, loading, refetch} = usePublicationsQuery(
    {
      variables: {request}
    }
  )

  // Set initial state of publications to a filtered version of the retrieved data
  const retrievedPublications = (data?.publications?.items as AnyPublication[] ?? []);
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;

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

  const filterPubs = () => {
    // TODO: update these with the actual filter functions based on Good or VHR metadata
    if (filterBy === 'All') {
      setFilteredPublications(retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (Post | Comment | Quote)[])
    } else if (filterBy === "Good") {
      setFilteredPublications(retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (Post | Comment | Quote)[])
    } else { // (filterBy === "VHR")
      setFilteredPublications(retrievedPublications.filter((pub) => pub.__typename !== 'Mirror') as (Post | Comment | Quote)[])
    }
  }

  const sortPubs = () => {
    // Publications should already be sorted at this point
    const arr = filteredPublications as (Post | Comment | Quote)[]

    if (sortBy === "Name") {
      setFilteredPublications(sortPubsName(arr))
    } else {
      setFilteredPublications(sortPubsAmount(arr))
    }
  }

  function sortPubsName(arr: (Post | Comment | Quote)[]): AnyPublication[] {
    if (arr.length <= 1) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(pub => pub.metadata?.content < pivot.metadata.content);
    const middle = arr.filter(pub => pub.metadata?.content === pivot.metadata.content);
    const right = arr.filter(pub => pub.metadata?.content > pivot.metadata.content);
  
    return [...sortPubsName(left), ...middle, ...sortPubsName(right)];
  }

  function sortPubsAmount(arr: (Post | Comment | Quote)[]): AnyPublication[] {
    if (arr.length <= 1) {
      return arr;
    }
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(pub => pub.metadata?.content < pivot.metadata.content);
    const middle = arr.filter(pub => pub.metadata?.content === pivot.metadata.content);
    const right = arr.filter(pub => pub.metadata?.content > pivot.metadata.content);
  
    return [...sortPubsAmount(left), ...middle, ...sortPubsAmount(right)];
  }

  return (
    <Card className="space-y-3 p-5">
      {/* Replace the "false" below with the attribute that tells us 
          whether the user is a volunteer or organization.
          E.g. currentProfile?.metadata?.attributes?[index of volunteer/organization] */}
          
      <div> {false ? "Incoming Requests" : "Outgoing Requests"}: </div>

      <div style={{ display: 'flex', gap: '6rem' }}>
        <span>
          <label htmlFor="sortBy">Sort By: </label>
          <select className="rounded-xl" id="sortBy" name="sortBy" onChange={(event) => {
              setSortBy(event.target.value)
              sortPubs()
            }}>
            <option value="Name" selected>Name</option>
            <option value="Amount">Amount</option>
          </select>
        </span>
        <span>
          <label htmlFor="filterBy">Filter By: </label>
          <select className="rounded-xl" id="filterBy" name="filterBy" onChange={(event) => {
              setFilterBy(event.target.value)
              filterPubs()
            }}>
            <option selected>All</option>
            <option>Good</option>
            <option>VHR</option>
          </select>
        </span>
      </div>

      <RequestTable publications={filteredPublications} />

    </Card>
  );
};

export default Requests;
