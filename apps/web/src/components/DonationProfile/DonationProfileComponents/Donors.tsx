import { gql, useApolloClient } from '@apollo/client';
import getAvatar from '@good/helpers/getAvatar';
import { type Profile } from '@good/lens';
import { Image } from '@good/ui';
import { Button } from '@headlessui/react';
import React, { useEffect, useState } from 'react';

import DonorsDisplayCard from '../Cards/DonorDisplayCard';

interface Donation {
  amount: string;
  causeId: string;
  createdAt: string;
  fromAddress: string;
  fromProfileId: string;
  id: string;
  tokenAddress: string;
  txHash: string;
}

interface DonorsProps {
  newDonors: Donation[];
  topDonors: Donation[];
}

const Donors: React.FC<DonorsProps> = ({ newDonors, topDonors }) => {
  const [showAllTopDonors, setShowAllTopDonors] = useState(false);
  const [showAllNewDonors, setShowAllNewDonors] = useState(false);
  const [newDonorsProfile, setNewDonorsProfile] = useState<Profile[]>([]);
  const [topDonorsProfile, setTopDonorsProfile] = useState<Profile[]>([]);
  const client = useApolloClient();

  useEffect(() => {
    const fetchNewDonorsProfiles = async () => {
      const profiles = [];
      for (const donor of newDonors) {
        const profileId = donor.fromProfileId;
        try {
          const { data } = await client.query({
            query: gql`
              query Profile($request: ProfileRequest!) {
                profile(request: $request) {
                  id
                  handle {
                    localName
                  }
                  metadata {
                    picture {
                      ... on ImageSet {
                        raw {
                          uri
                        }
                        optimized {
                          uri
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              request: {
                forProfileId: '0x0209'
              }
            }
          });

          profiles.push(data.profile);
        } catch (error) {}
      }

      setNewDonorsProfile(profiles);
    };

    const fetchTopDonorsProfiles = async () => {
      const profiles: Profile[] = [];
      for (const donor of topDonors) {
        const profileId = donor.fromProfileId;
        try {
          const { data } = await client.query({
            query: gql`
              query Profile($request: ProfileRequest!) {
                profile(request: $request) {
                  id
                  handle {
                    localName
                  }
                  metadata {
                    picture {
                      ... on ImageSet {
                        raw {
                          uri
                        }
                        optimized {
                          uri
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              request: {
                forProfileId: '0x0209'
              }
            }
          });
          profiles.push(data.profile);
        } catch (error) {}
      }
      setTopDonorsProfile(profiles);
    };

    fetchNewDonorsProfiles();
    fetchTopDonorsProfiles();
  }, [newDonors, topDonors]);

  const handleShowAllTopDonors = () => {
    setShowAllTopDonors(true);
  };

  const handleShowAllNewDonors = () => {
    setShowAllNewDonors(true);
  };

  const renderSupporters = (
    donorProfiles: Profile[],
    donations: Donation[],
    showAll: boolean
  ) => {
    const displayedDonors = showAll ? donorProfiles : donorProfiles.slice(0, 5);

    return displayedDonors.map((donorProfile, index) => {
      const donation = donations[index];
      return (
        <div
          className="supporter-details mb-5 flex flex-col items-center"
          key={index}
        >
          <div className="flex items-center">
            <Image
              alt={donorProfile.handle?.localName}
              className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
              height={10}
              src={getAvatar(donorProfile)}
              width={10}
            />
            <div className="ml-4">
              <p>{donorProfile?.handle?.localName}</p>
              <p>${donation.amount}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="-top-10 items-center justify-center rounded">
      <div className="flex justify-center">
        <div className="w-1/2 pr-4">
          <div className="mb-5 text-lg">
            <h3 className="text-center">Top Donors</h3>
          </div>
          <div className="flex flex-col items-center">
            {topDonors.length > 0 ? (
              renderSupporters(topDonorsProfile, topDonors, showAllTopDonors)
            ) : (
              <Button
                className="w-3/4 rounded-full px-4 py-2 text-sm text-white hover:bg-gray-300/20"
                style={{ background: '#da5597' }}
              >
                Be our first donor!
              </Button>
            )}
            <div className="mt-5 w-full text-center">
              {topDonors.length > 0 && (
                <DonorsDisplayCard
                  allNewDonors={newDonors}
                  allTopDonors={topDonors}
                  newDonorProfiles={newDonorsProfile}
                  top={true}
                  topDonorProfiles={topDonorsProfile}
                />
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 pl-4">
          <div className="mb-5 text-lg">
            <h3 className="text-center">New Donors</h3>
          </div>
          <div className="flex flex-col items-center">
            {newDonors.length > 0 ? (
              renderSupporters(newDonorsProfile, newDonors, showAllNewDonors)
            ) : (
              <button
                className="w-3/4 rounded-full px-4 py-2 text-sm text-white hover:bg-gray-300/20"
                style={{ background: '#da5597' }}
              >
                Be our first donor!
              </button>
            )}
            <div className="mt-5 w-full text-center">
              {newDonors.length > 0 && (
                <DonorsDisplayCard
                  allNewDonors={newDonors}
                  allTopDonors={topDonors}
                  newDonorProfiles={newDonorsProfile}
                  top={false}
                  topDonorProfiles={topDonorsProfile}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donors;
