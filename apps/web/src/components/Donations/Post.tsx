'use client';

import { CurrencyDollarIcon as CurrencyDollarIconOutline } from '@heroicons/react/24/outline';
import { useState } from 'react';

import DonationModal from './DonationModal';

const Post = ({ index, length, post }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleDonateClick = (post: any) => {
    setSelectedPost(post);
    setShowModal(true);
  };
  return (
    <>
      <div className="rounded-lg bg-white p-4" key={post.id}>
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
        {post.image && (
          <img
            alt="Post"
            className="mb-4 h-auto w-full rounded-lg"
            src={post.image}
          />
        )}
        <div className="mb-4 text-sm">{post.description}</div>
        <div className="flex items-center text-sm text-gray-500">
          <div
            className="mr-4 flex items-center"
            onClick={() => handleDonateClick(post)}
          >
            <CurrencyDollarIconOutline className="mr-1 size-8" />
            {post.donations.length} Donations
          </div>
          <div className="mr-4 flex items-center">
            <div className="mr-1" />
            {post.likes} likes
          </div>
          <div className="flex items-center">
            <div className="mr-1" />
            {post.comments} comments
          </div>
        </div>
      </div>
      {index < length - 1 && <hr className="my-6 border-gray-300" />}
      <DonationModal
        onClose={() => setShowModal(false)}
        post={selectedPost}
        show={showModal}
      />
    </>
  );
};

export default Post;
