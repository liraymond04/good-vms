import {
  MagnifyingGlassIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

const suggestedPeople = [
  {
    avatar: 'https://via.placeholder.com/40',
    handle: '@helenahills',
    name: 'Helena Hills'
  },
  {
    avatar: 'https://via.placeholder.com/40',
    handle: '@charlestran',
    name: 'Charles Tran'
  },
  {
    avatar: 'https://via.placeholder.com/40',
    handle: '@oscardavis',
    name: 'Oscar Davis'
  },
  {
    avatar: 'https://via.placeholder.com/40',
    handle: '@danielj',
    name: 'Daniel Jay Park'
  },
  {
    avatar: 'https://via.placeholder.com/40',
    handle: '@carloj',
    name: 'Carlo Rojas'
  }
];

const communities = [
  {
    icon: 'https://via.placeholder.com/40',
    members: '13.2k',
    name: 'Design Enthusiasts'
  },
  {
    icon: 'https://via.placeholder.com/40',
    members: '2k',
    name: 'Photographers of SF'
  },
  {
    icon: 'https://via.placeholder.com/40',
    members: '125',
    name: 'Marina crew'
  }
];

const Communities = () => {
  return (
    <div className="mt-6 rounded-lg bg-white p-4 shadow-md dark:border dark:border-gray-700 dark:bg-black dark:shadow-none">
      <h3 className="mb-4 text-sm font-bold">Communities you might like</h3>
      <ul>
        {communities.map((community, index) => (
          <li className="mb-4 flex items-center" key={index}>
            <img
              alt={community.name}
              className="mr-4 h-10 w-10 rounded-full"
              src={community.icon}
            />
            <div>
              <p className="text-sm font-semibold">{community.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-100">
                {community.members} members
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SuggestedPeople = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:border dark:border-gray-700 dark:bg-black dark:shadow-none">
      <h3 className="mb-4 text-sm font-bold">Suggested people</h3>
      <ul>
        {suggestedPeople.map((person, index) => (
          <li className="mb-4 flex items-center" key={index}>
            <img
              alt={person.name}
              className="mr-4 h-10 w-10 rounded-full"
              src={person.avatar}
            />
            <div>
              <p className="text-sm font-semibold">{person.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-100">
                {person.handle}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className="flex flex-row items-center rounded-full bg-[#F0F0F0] dark:bg-[#828282] dark:bg-opacity-[35%]">
      <MagnifyingGlassIcon className="ml-3 size-5 dark:text-[#888888]" />
      <input
        className="w-full border-none bg-transparent p-2 focus:ring-0 dark:placeholder:text-[#888888]"
        placeholder="Search"
        type="text"
      />
      <button className="mr-3 size-5">
        <MicrophoneIcon className="dark:text-[#888888]" />
      </button>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="space-y-6">
      <SearchBar />
      <SuggestedPeople />
      <Communities />
    </div>
  );
};

export default Sidebar;
