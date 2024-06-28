import Post from './Post';

const DonationsFeed = () => {
  const posts = [
    {
      comments: 4,
      description: 'Post description #DONATION',
      donations: [
        {
          amount: 20,
          currency: 'Bonsai',
          user: {
            avatar: 'https://example.com/path-to-avatar1.jpg',
            name: 'Charles Tran'
          }
        },
        {
          amount: 5,
          currency: 'USD Coin',
          user: {
            avatar: 'https://example.com/path-to-avatar2.jpg',
            name: 'Oscar Davis'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        }
      ],
      id: 1,
      image: 'https://via.placeholder.com/600x400',
      likes: 21,
      time: '3 min ago',
      user: {
        avatar: 'https://via.placeholder.com/40',
        name: 'Helena'
      }
    },
    {
      comments: 18,
      description:
        'Body text for a post. Since it’s a social app, sometimes it’s a hot take, and sometimes it’s a question. #DONATION',
      donations: [
        {
          amount: 20,
          currency: 'Bonsai',
          user: {
            avatar: 'https://example.com/path-to-avatar1.jpg',
            name: 'Charles Tran'
          }
        },
        {
          amount: 5,
          currency: 'USD Coin',
          user: {
            avatar: 'https://example.com/path-to-avatar2.jpg',
            name: 'Oscar Davis'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        }
      ],
      id: 2,
      likes: 6,
      time: '2 hrs ago',
      user: {
        avatar: 'https://via.placeholder.com/40',
        name: 'Charles'
      }
    },
    {
      comments: 5,
      description: 'Pics from my most recent hike ✌️ #DONATION',
      donations: [
        {
          amount: 20,
          currency: 'Bonsai',
          user: {
            avatar: 'https://example.com/path-to-avatar1.jpg',
            name: 'Charles Tran'
          }
        },
        {
          amount: 5,
          currency: 'USD Coin',
          user: {
            avatar: 'https://example.com/path-to-avatar2.jpg',
            name: 'Oscar Davis'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        }
      ],
      id: 3,
      image: 'https://via.placeholder.com/600x400',
      likes: 58,
      time: '1 day ago',
      user: {
        avatar: 'https://via.placeholder.com/40',
        name: 'Oscar'
      }
    },
    {
      comments: 44,
      description:
        'Body text for a post. Since it’s a social app, sometimes it’s sharing tips, and sometimes it’s freeloading. #DONATION',
      donations: [
        {
          amount: 20,
          currency: 'Bonsai',
          user: {
            avatar: 'https://example.com/path-to-avatar1.jpg',
            name: 'Charles Tran'
          }
        },
        {
          amount: 5,
          currency: 'USD Coin',
          user: {
            avatar: 'https://example.com/path-to-avatar2.jpg',
            name: 'Oscar Davis'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        }
      ],
      id: 4,
      likes: 85,
      time: '6 hrs ago',
      user: {
        avatar: 'https://via.placeholder.com/40',
        name: 'Mark Rojas'
      }
    },
    {
      comments: 5,
      description:
        'Body text for a post. Since it’s a social app, sometimes it’s an observation, and sometimes it’s seeking recommendations. #DONATION',
      donations: [
        {
          amount: 20,
          currency: 'Bonsai',
          user: {
            avatar: 'https://example.com/path-to-avatar1.jpg',
            name: 'Charles Tran'
          }
        },
        {
          amount: 5,
          currency: 'USD Coin',
          user: {
            avatar: 'https://example.com/path-to-avatar2.jpg',
            name: 'Oscar Davis'
          }
        },
        {
          amount: 75,
          currency: 'Tether USD',
          user: {
            avatar: 'https://example.com/path-to-avatar3.jpg',
            name: 'Carlo Rojas'
          }
        }
      ],
      id: 5,
      likes: 58,
      time: '3 hrs ago',
      user: {
        avatar: 'https://via.placeholder.com/40',
        name: 'Daniel Jay Park'
      }
    }
  ];

  return (
    <div className="mx-auto my-8 max-w-2xl space-y-6">
      <div className="rounded-lg bg-white p-4 shadow-md">
        {posts.map((post, index) => (
          <Post index={index} key={post.id} length={posts.length} post={post} />
        ))}
      </div>
    </div>
  );
};

export default DonationsFeed;
