import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { GridLayout, GridItemEight, GridItemFour } from '@good/ui';
import DonationInfo from './DonationProfileComponents/DonationInfo';
import DonationMeter from './DonationProfileComponents/DonationMeter';
import DonationThumbnail from './DonationProfileComponents/DonationThumbnail';
import Donors from './DonationProfileComponents/Donors';
import { Leafwatch } from '@helpers/leafwatch';
import { Post, Profile } from '@good/lens';
import useGetSingleCause from 'src/hooks/useGetSingleCause';

const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentProfile = useProfileStore();
  const { data: posts, error, loading } = useGetSingleCause();
  const [donationPost, setDonationPost] = useState<Post | null>(null);
  const [allDonors, setAllDonors] = useState<any>(null); 
  const [topDonors, setTopDonors] = useState<any>(null); 
  const [newDonors, setNewDonors] = useState<any>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        if (!id || !posts) return;

        const params = new URLSearchParams()
        const parts = id?.toString().split('-')!
        params.append('profileId',parts[0].substring(3))
        params.append('publicationId', parts[1].substring(2))
        const response = await fetch( `http://api-testnet.bcharity.net/donations/all-donations-on-post?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch donation details');
        }
        const donors = await response.json();
        setAllDonors(donors.donations);

        const topSortedDonors = donors.donations.slice().sort((a: any, b: any) => {
          return parseFloat(b.amount) - parseFloat(a.amount);
        });
        setTopDonors(topSortedDonors);

        const recentSortedDonors = donors.donations.slice().sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
          console.error(`Post with id ${id} not found.`);
        }
      } catch (error) {
        console.error('Error fetching donation details:', error);
      }
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
    return <div>Donation not found</div>; 
  }

  const DonationPostDetails = {
    DonatedAmount: [
      {
        current: 200,
        goal: 1000
      }
    ],
  };


  return (
    <>
      <GridLayout>
        <GridItemEight className="space-y-5">
          <DonationThumbnail post={donationPost} />
          
          <DonationInfo post={donationPost} />

          <Donors newDonors={newDonors} topDonors={topDonors} />
        </GridItemEight>

        <GridItemFour>
          <DonationMeter
            goal={DonationPostDetails.DonatedAmount[0].goal}
            total={DonationPostDetails.DonatedAmount[0].current}
          />
        </GridItemFour>
      </GridLayout>
    </>
  );
};

export default DonationDetails;
