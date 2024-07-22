import type { FC, ReactNode } from 'react';

import NavPost from '@components/Composer/Post/NavPost';
import cn from '@good/ui/cn';
import {
  Bars3Icon,
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline
} from '@heroicons/react/24/outline';
import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';

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

  const NavItem: FC<{ current: boolean; icon: ReactNode; url: string }> = ({
    current,
    icon,
    url
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
    <div className="md:hidden">
      {/* Ensure the whole div is hidden on non-mobile views */}
      <div className="fixed bottom-16 right-4 z-20 flex h-[50px] w-[50px] items-center justify-center">
        <NavPost />
      </div>
      <button
        className="fixed right-4 z-20 rounded-full bg-pink-700 p-2 text-white shadow-lg focus:outline-none"
        onClick={toggleMenu}
        style={{
          alignItems: 'center',
          bottom: '150px', // Raised the button more
          display: 'flex',
          height: '50px',
          justifyContent: 'center',
          width: '50px'
        }}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      {showMenu && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={closeMenu}
          style={{
            opacity: showMenu ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <div
            className="absolute bottom-48 right-4 rounded-lg bg-white p-6 shadow-lg dark:bg-black" // Raised the menu more
            onClick={(e) => e.stopPropagation()}
            style={{
              transform: showMenu ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s ease-in-out'
            }}
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
            <MenuItems />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenuButton;
