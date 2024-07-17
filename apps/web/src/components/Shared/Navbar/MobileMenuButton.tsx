import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import {
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  Bars3Icon
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from '@good/ui/cn';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import MoreNavItems from './MoreNavItems';
import MenuItems from './MenuItems';
import NavPost from '@components/Composer/Post/NavPost';

const MobileMenuButton: FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { pathname } = useRouter();
  const { currentProfile } = useProfileStore();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const NavItem: FC<{ url: string; current: boolean; icon: ReactNode }> = ({
    url,
    current,
    icon
  }) => (
    <Link
      className={cn(
        'mb-4 flex cursor-pointer items-start space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800',
        {
          'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': current,
          'text-gray-700 dark:text-gray-300': !current
        }
      )}
      href={url}
      onClick={closeMenu}
    >
      {icon}
    </Link>
  );

  return (
    <div className="md:hidden"> {/* Ensure the whole div is hidden on non-mobile views */}
      <button
        className="fixed right-4 z-20 p-2 bg-pink-500 text-white rounded-full shadow-lg focus:outline-none"
        style={{
          bottom: '80px', // Adjusted position
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <NavPost />
      </button>
      <button
        className="fixed right-4 z-20 p-2 bg-pink-700 text-white rounded-full shadow-lg focus:outline-none"
        style={{
          bottom: '150px', // Raised the button more
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={toggleMenu}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      {showMenu && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: showMenu ? 1 : 0
          }}
          onClick={closeMenu}
        >
          <div
            className="absolute bottom-48 right-4 p-6 bg-white dark:bg-black rounded-lg shadow-lg" // Raised the menu more
            style={{
              transition: 'transform 0.3s ease-in-out',
              transform: showMenu ? 'translateY(0)' : 'translateY(100%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <NavItem
              current={pathname === '/'}
              icon={
                pathname === '/' ? (
                  <HomeIconSolid className="h-8 w-8" />
                ) : (
                  <HomeIconOutline className="h-8 w-8" />
                )
              }
              url="/"
            />
            <NavItem
              current={pathname === '/explore'}
              icon={
                pathname === '/explore' ? (
                  <MagnifyingGlassIconSolid className="h-8 w-8" />
                ) : (
                  <MagnifyingGlassIconOutline className="h-8 w-8" />
                )
              }
              url="/explore"
            />
            <NavItem
              current={pathname === '/notifications'}
              icon={
                pathname === '/notifications' ? (
                  <BellIconSolid className="h-8 w-8" />
                ) : (
                  <BellIconOutline className="h-8 w-8" />
                )
              }
              url="/notifications"
            />
            <NavItem
              current={pathname === '/messages'}
              icon={
                pathname === '/messages' ? (
                  <EnvelopeIconSolid className="h-8 w-8" />
                ) : (
                  <EnvelopeIconOutline className="h-8 w-8" />
                )
              }
              url="/messages"
            />
            <MoreNavItems onClick={closeMenu} />
            <MenuItems onClick={closeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenuButton;
