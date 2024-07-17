import type { FC } from 'react';
import cn from '@good/ui/cn';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  BookmarkIcon,
  CurrencyDollarIcon,
  EllipsisHorizontalCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import MenuTransition from '../MenuTransition';
import MoreLink from './NavItems/MoreLink';
import Support from './NavItems/Support';

const MoreNavItems: FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { currentProfile } = useProfileStore();

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton
            className={cn(
              'flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm tracking-wide',
              {
                'bg-gray-200 text-black dark:bg-gray-800 dark:text-white': open,
                'text-white-700 dark:text-white-300 hover:bg-gray-200 hover:text-black dark:hover:bg-gray-800 dark:hover:text-white':
                  !open
              }
            )}
          >
            <EllipsisHorizontalCircleIcon className="size-8" />
            <span className="hidden lg:block text-lg">More</span> {/* Hide text on tablets */}
          </MenuButton>
          <MenuTransition>
            <MenuItems
              className={cn(
                'absolute z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:ring-gray-700',
                'md:fixed md:left-40 md:top-48'
              )}
              style={{
                right: '100%',
                marginRight: '10px' // Adjusted for better alignment
              }}
            >
              {currentProfile ? (
                <>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <MoreLink
                      href="/bookmarks"
                      icon={<BookmarkIcon className="size-4" />}
                      text="Bookmarks"
                      hideTextOnMobile
                      onClick={onClick}
                    />
                  </MenuItem>
                  <MenuItem
                    as="div"
                    className={({ focus }: { focus: boolean }) =>
                      cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                    }
                  >
                    <MoreLink
                      href="https://www.volunteerconnector.org/"
                      icon={<UserIcon className="size-4" />}
                      text="Volunteer"
                      hideTextOnMobile
                      onClick={onClick}
                    />
                  </MenuItem>
                  <MenuItem>
                    <Menu as="div" className="relative m-2 rounded-lg">
                      {({ open }) => (
                        <>
                          <MenuButton
                            className={cn(
                              'flex w-full cursor-pointer items-center space-x-2 rounded-md px-2 py-1 text-left text-sm tracking-wide text-gray-700 hover:bg-gray-200 hover:text-black md:px-3 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white',
                              {
                                'text-gray-700 dark:text-gray-200': open,
                                'text-gray-700 hover:bg-gray-200 hover:text-black dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white':
                                  !open
                              }
                            )}
                          >
                            <CurrencyDollarIcon className="ml-[-4px] size-4" />
                            <span className="block md:hidden lg:block text-m text-gray-700 dark:text-gray-200">
                              Donate
                            </span>
                          </MenuButton>
                          <MenuTransition>
                            <MenuItems className="absolute md:left-full md:ml-2 bottom-full md:origin-bottom-left md:right-auto right-full mr-2 origin-bottom-right z-50 w-32 rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 dark:ring-gray-700">
                              <MenuItem
                                as="div"
                                className={({ focus }: { focus: boolean }) =>
                                  cn(
                                    { 'dropdown-active': focus },
                                    'm-1 rounded-lg'
                                  )
                                }
                                onClick={onClick}
                              >
                                <MoreLink href="/donations" text="Donations" hideTextOnMobile />
                              </MenuItem>
                              <MenuItem
                                as="div"
                                className={({ focus }: { focus: boolean }) =>
                                  cn(
                                    { 'dropdown-active': focus },
                                    'm-1 rounded-lg'
                                  )
                                }
                                onClick={onClick}
                              >
                                <MoreLink
                                  href="https://giveth.io"
                                  text="Giveth"
                                  hideTextOnMobile
                                />
                              </MenuItem>
                              <MenuItem
                                as="div"
                                className={({ focus }: { focus: boolean }) =>
                                  cn(
                                    { 'dropdown-active': focus },
                                    'm-1 rounded-lg'
                                  )
                                }
                                onClick={onClick}
                              >
                                <MoreLink
                                  href="https://thegivingblock.com"
                                  text="GivingBlock"
                                  hideTextOnMobile
                                />
                              </MenuItem>
                              <MenuItem
                                as="div"
                                className={({ focus }: { focus: boolean }) =>
                                  cn(
                                    { 'dropdown-active': focus },
                                    'm-1 rounded-lg'
                                  )
                                }
                                onClick={onClick}
                              >
                                <MoreLink
                                  href="https://gitcoin.co"
                                  text="Gitcoin"
                                  hideTextOnMobile
                                />
                              </MenuItem>
                            </MenuItems>
                          </MenuTransition>
                        </>
                      )}
                    </Menu>
                  </MenuItem>
                  <div className="divider" />
                </>
              ) : null}
              <MenuItem
                as="div"
                className={({ focus }: { focus: boolean }) =>
                  cn({ 'dropdown-active': focus }, 'm-2 rounded-lg')
                }
                onClick={onClick}
              >
                <Support hideTextOnMobile />
              </MenuItem>
            </MenuItems>
          </MenuTransition>
        </>
      )}
    </Menu>
  );
};

export default MoreNavItems;
