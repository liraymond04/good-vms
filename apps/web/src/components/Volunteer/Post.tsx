// Post.jsx
import {
  ArchiveBoxIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Post = ({ post }: any) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center">
        <img
          alt={post.user.name}
          className="h-10 w-10 rounded-full"
          src={post.user.avatar}
        />
        <div className="ml-3">
          <div className="text-sm font-semibold">{post.user.name}</div>
          <div className="text-xs text-gray-500">{post.time}</div>
        </div>
      </div>
      <div className="mb-4 text-sm">
        {post.description.length > 100 && !showMore ? (
          <>
            {post.description.substring(0, 100)}...
            <button className="text-pink-500" onClick={toggleShowMore}>
              Show more
            </button>
          </>
        ) : (
          post.description
        )}
      </div>
      {post.image && (
        <img
          alt="Post"
          className="mb-4 h-auto w-full rounded-lg"
          src={post.image}
        />
      )}
      <div className="flex items-center text-sm text-gray-500">
        <div className="mr-4 flex items-center">
          <UserGroupIcon className="mr-1 h-5 w-5" />
          {post.volunteers} Volunteers
        </div>
        <div className="mr-4 flex items-center">
          <ChatBubbleLeftIcon className="mr-1 h-5 w-5" />
          {post.comments} comments
        </div>
        <div className="mr-4 flex items-center">
          <ArrowPathIcon className="mr-1 h-5 w-5" />
          {post.shares} shares
        </div>
        <div className="mr-4 flex items-center">
          <HeartIcon className="mr-1 h-5 w-5" />
          {post.likes} likes
        </div>
        <div className="flex items-center">
          <ArchiveBoxIcon className="mr-1 h-5 w-5" />
          {post.archives} archives
        </div>
      </div>
    </div>
  );
};

export default Post;
