import type { StateSnapshot, VirtuosoHandle } from 'react-virtuoso';

import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { EmptyState, ErrorMessage } from '@good/ui';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useExploreCauses from 'src/hooks/useExploreCauses';

import DonationPost from './DonationPost';

let virtuosoState: any = { ranges: [], screenTop: 0 };

const DonationsFeed = () => {
  const virtuoso = useRef<VirtuosoHandle>(null);
  const {
    data: posts,
    error,
    fetchingMore,
    fetchMore,
    loading
  } = useExploreCauses();

  if (loading && !fetchingMore) {
    return <PublicationsShimmer />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load causes" />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon className="size-8" />}
        message="No causes yet!"
      />
    );
  }

  const onScrolling = (scrolling: boolean) => {
    if (!scrolling) {
      virtuoso?.current?.getState((state: StateSnapshot) => {
        virtuosoState = { ...state };
      });
    }
  };

  return (
    <Virtuoso
      computeItemKey={(index, post) => `${post.id}-${index}`}
      data={posts}
      endReached={fetchMore}
      isScrolling={onScrolling}
      itemContent={(index, post) => {
        return (
          <DonationPost
            index={index}
            key={post.id}
            length={posts.length}
            post={post}
          />
        );
      }}
      ref={virtuoso}
      restoreStateFrom={
        virtuosoState.ranges.length === 0
          ? virtuosoState?.current?.getState((state: StateSnapshot) => state)
          : virtuosoState
      }
      useWindowScroll
    />
  );
};

export default DonationsFeed;
