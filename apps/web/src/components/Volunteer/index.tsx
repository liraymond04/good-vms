'use client';
import Sidebar from '@components/Donations/Sidebar';
import { GridItemEight, GridItemFour, GridLayout } from '@good/ui';

import VolunteerFeed from './VolunteerFeed';

const samplePosts = [
  {
    archives: 33,
    comments: 44,
    description:
      'Embrace the unknown, for within uncertainty lies the potential for greatness. Every challenge is an opportunity in disguise, waiting to be transformed into a stepping stone for success. Keep pushing forward, believe in your ability to ...',
    image: 'https://via.placeholder.com/600x400',
    likes: 72,
    shares: 21,
    time: '3 min ago',
    user: {
      avatar: 'https://via.placeholder.com/150',
      name: 'Helena'
    },
    volunteers: 18
  },
  {
    archives: 33,
    comments: 44,
    description:
      'Body text for a post. Since it’s a social app, sometimes it’s a hot take, and sometimes it’s a question. #DONATION',
    likes: 72,
    shares: 21,
    time: '2 hrs ago',
    user: {
      avatar: 'https://via.placeholder.com/150',
      name: 'Charles'
    },
    volunteers: 18
  },
  {
    archives: 33,
    comments: 44,
    description: 'Pics from my most recent hike ✌️ #DONATION',
    image: 'https://via.placeholder.com/600x400',
    likes: 72,
    shares: 21,
    time: '1 day ago',
    user: {
      avatar: 'https://via.placeholder.com/150',
      name: 'Oscar'
    },
    volunteers: 18
  },
  {
    archives: 33,
    comments: 44,
    description:
      'Every sunrise brings a new opportunity to chase your dreams and make a difference. Start your day with a grateful heart and a determined spirit. Remember, the journey to ...',
    likes: 72,
    shares: 21,
    time: '6 hrs ago',
    user: {
      avatar: 'https://via.placeholder.com/150',
      name: 'Mark Rojas'
    },
    volunteers: 18
  },
  {
    archives: 33,
    comments: 44,
    description:
      'Body text for a post. Since it’s a social app, sometimes it’s an observation, and sometimes it’s seeking recommendations. #DONATION',
    likes: 72,
    shares: 21,
    time: '3 hrs ago',
    user: {
      avatar: 'https://via.placeholder.com/150',
      name: 'Daniel Jay Park'
    },
    volunteers: 18
  }
];

const Volunteer = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-4">
        <div className="text-grey-400 flex gap-4">
          <VolunteerFeed posts={samplePosts} />
        </div>
      </GridItemEight>

      <GridItemFour>
        <Sidebar />
      </GridItemFour>
    </GridLayout>
  );
};

export default Volunteer;
