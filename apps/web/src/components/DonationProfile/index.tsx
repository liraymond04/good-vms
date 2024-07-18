import type { Post } from '@good/lens';
import type { NextPage } from 'next';

import { GOOD_API_URL } from '@good/data/constants';
import { GridItemEight, GridItemFour, GridLayout } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useGetSingleCause from 'src/hooks/useGetSingleCause';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import DonationInfo from './DonationProfileComponents/DonationInfo';
import DonationMeter from './DonationProfileComponents/DonationMeter';
import DonationThumbnail from './DonationProfileComponents/DonationThumbnail';
import Donors from './DonationProfileComponents/Donors';

const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentProfile = useProfileStore();
  const { data: posts, error, loading } = useGetSingleCause();
  const [donationPost, setDonationPost] = useState<null | Post>(null);
  const [allDonors, setAllDonors] = useState<any>(null);
  const [topDonors, setTopDonors] = useState<any>(null);
  const [newDonors, setNewDonors] = useState<any>(null);
  const [totalDonated, setTotalDonated] = useState<number>(0);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        if (!id || !posts) {
          return;
        }

        const params = new URLSearchParams();
        const parts = id?.toString().split('-')!;
        params.append('profileId', Number(parts[0]).toString(16));
        params.append('publicationId', Number(parts[1]).toString(16));
        const response = await fetch(
          `${GOOD_API_URL}/donations/all-donations-on-post?${params}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch donation details');
        }
        const donors = await response.json();
        setAllDonors(donors.donations);

        let totalAmountDonated = 0;
        for (const donation of donors.donations) {
          totalAmountDonated += parseFloat(donation.amount);
        }
        setTotalDonated(totalAmountDonated);

        const topSortedDonors = donors.donations
          .slice()
          .sort((a: any, b: any) => {
            return parseFloat(b.amount) - parseFloat(a.amount);
          });
        setTopDonors(topSortedDonors);

        const recentSortedDonors = donors.donations
          .slice()
          .sort((a: any, b: any) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        setNewDonors(recentSortedDonors);

        const matchingPost = posts.find((post: any) => post.id === id);
        if (matchingPost) {
          setDonationPost(matchingPost);

          const topSortedDonors = [...donors].sort((a: any, b: any) => {
            return parseFloat(b.amount) - parseFloat(a.amount);
          });
          setTopDonors(topSortedDonors);

          Leafwatch.track('PAGEVIEW', { page: `donations/${id}` });
        } else {
        }
      } catch (error) {}
    };

    fetchDonationDetails();
  }, [id, posts]);

  if (!currentProfile) {
    return <div>Not signed in</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!donationPost) {
    return (
      <GridLayout>
        <GridItemEight>
          <div>Donation not found</div>
        </GridItemEight>
      </GridLayout>
    );
  }

  const DonationPostDetails = {
    DonatedAmount: [
      {
        current: 200,
        goal: 1000
      }
    ]
  };

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <DonationThumbnail post={donationPost} />

        <DonationInfo post={donationPost} />

        <Donors newDonors={newDonors} topDonors={topDonors} />
      </GridItemEight>

      <GridItemFour>
        <DonationMeter
          goal={DonationPostDetails.DonatedAmount[0].goal}
          total={totalDonated}
        />
      </GridItemFour>
    </GridLayout>
  );
};

export default DonationDetails;
