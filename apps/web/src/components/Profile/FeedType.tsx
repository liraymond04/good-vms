import type { Dispatch, FC, SetStateAction } from 'react';

import { PROFILE } from '@good/data/tracking';
import { TabButton } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  FilmIcon,
  FlagIcon,
  PencilSquareIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { ProfileFeedType } from 'src/enums';
import { useProStore } from 'src/store/non-persisted/useProStore';

import MediaFilter from './Filters/MediaFilter';

interface FeedTypeProps {
  feedType: ProfileFeedType;
  setFeedType?: Dispatch<SetStateAction<ProfileFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const { isPro } = useProStore();

  const switchTab = (type: ProfileFeedType) => {
    if (setFeedType) {
      setFeedType(type);
    }
    Leafwatch.track(PROFILE.SWITCH_PROFILE_FEED_TAB, {
      profile_feed_type: type.toLowerCase()
    });
  };

  const iconClass = 'size-8 sm:size-4';

  const tabs = [
    {
      icon: <PencilSquareIcon className={iconClass} />,
      name: 'Feed',
      type: ProfileFeedType.Feed
    },
    {
      icon: <ChatBubbleLeftIcon className={iconClass} />,
      name: 'Replies',
      type: ProfileFeedType.Replies
    },
    {
      icon: <FilmIcon className={iconClass} />,
      name: 'Media',
      type: ProfileFeedType.Media
    },
    {
      icon: <RectangleStackIcon className={iconClass} />,
      name: 'Collected',
      type: ProfileFeedType.Collects
    },
    {
      icon: <FlagIcon className={iconClass} />,
      name: 'Requests',
      type: ProfileFeedType.Requests
    },
    isPro && {
      icon: <ChartBarIcon className={iconClass} />,
      name: 'Stats',
      type: ProfileFeedType.Stats
    }
  ].filter(
    (tab): tab is { icon: JSX.Element; name: string; type: ProfileFeedType } =>
      Boolean(tab)
  );

  return (
    <div className="flex items-center justify-between">
      <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2 sm:mt-0 sm:px-0 md:pb-0">
        {tabs.map((tab) => (
          <TabButton
            active={feedType === tab.type}
            icon={tab.icon}
            key={tab.type}
            name={tab.name}
            onClick={() => switchTab(tab.type)}
            type={tab.type.toLowerCase()}
          />
        ))}
      </div>
      {feedType === ProfileFeedType.Media && <MediaFilter />}
    </div>
  );
};

export default FeedType;
