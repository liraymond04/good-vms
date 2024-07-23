// VolunteerFeed.jsx
import Post from './Post';

const VolunteerFeed = ({ posts }: any) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between gap-4">
        <select className="w-full appearance-none rounded border-none bg-pink-600 p-2 text-white focus:ring-0">
          <option>Categories</option>
        </select>
        <select className="w-full appearance-none rounded border-none bg-pink-600 p-2 text-white focus:ring-0">
          <option>Organizations</option>
        </select>
      </div>
      {posts.map((post: any, index: any) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default VolunteerFeed;
