// pages/donations/[id]/index.tsx

import type { NextPage } from 'next';

import { PAGEVIEW } from '@good/data/tracking';
import { GridItemEight, GridItemFour, GridLayout } from '@good/ui';
import { Leafwatch } from '@helpers/leafwatch';
import { useRouter } from 'next/router';
import { useEffect,useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import getPublicationData from '@good/helpers/getPublicationData';
import { useQuery, gql } from '@apollo/client';

import DonationInfo from './DonationProfileComponents/DonationInfo';
import DonationMeter from './DonationProfileComponents/DonationMeter';
import DonationThumbnail from './DonationProfileComponents/DonationThumbnail';
import Donors from './DonationProfileComponents/Donors';
import WordsOfSupport from './DonationProfileComponents/WordsOfSupport';
import type { Post } from '@good/lens';

import { GOOD_API_URL } from '@good/data/constants';

interface DonationDetailsProps{
  post: Post;
}

const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { currentProfile } = useProfileStore();
  const { id } = router.query;
  const [donationDetails, setDonationDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const params = new URLSearchParams()
        const parts = id?.toString().split('-')!
        console.log(id)
        console.log(parts)
        params.append('profileId',parts[1].substring(2))
        params.append('publicationId', parts[0].substring(2))
        const response = await fetch( `http://api-testnet.bcharity.net/donations/all-donations-on-post?${params}`)
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch donation details');
        }
        const data = await response.json();
   
        console.log( data)
    
        Leafwatch.track(PAGEVIEW, { page: `donations/${id}` });

      } catch (error) {
        console.error('Error fetching donation details:', error);
      }
    };
  
    if (id) {
      fetchDonationDetails();
    }
  }, [id]);
  

  if (!currentProfile) {
    return <div>Not signed in</div>;
  }

  const DonationPostDetails = {
    DonatedAmount: [
      {
        current: 200,
        goal: 1000
      }
    ],
    DonationInfo: [
      {
        mission:
          'Body text of donation post, explains purpose of the donation/cause',
        updated: new Date(), // date of donation's post updates
        updateImages: [
          'https://picsum.photos/200/300',
          'https://picsum.photos/200/300',
          'https://picsum.photos/200/300'
        ], //any images for the updates, can be null. Images displayed in a 3 columns layout
        updateText:
          'Text for any updates to the donations post, accompanied by the date it was updated'
      }
    ],
    missionThumbnail:
      'https://globalnews.ca/wp-content/uploads/2020/11/South-Delta-Food-Bank-food-in-bags.jpg?quality=85&strip=all',
    organizer: currentProfile, //this will be profile of the donations post creator, placeholder for now
    title: 'Food Bank'
  };

  const topDonors = [
    { amount: 100, supporter: currentProfile },
    { amount: 200, supporter: currentProfile },
    { amount: 150, supporter: currentProfile },
    { amount: 120, supporter: currentProfile },
    { amount: 180, supporter: currentProfile },
    { amount: 250, supporter: currentProfile }
  ];

  const newDonors = [
    { amount: 80, supporter: currentProfile },
    { amount: 110, supporter: currentProfile },
    { amount: 95, supporter: currentProfile },
    { amount: 180, supporter: currentProfile },
    { amount: 250, supporter: currentProfile }
  ];

  return (
    <>
      {/**apps\web\src\components\Publication\FullPublication.tsx regular user post reference */}
      <GridLayout>
        <GridItemEight className="space-y-5">
          <DonationThumbnail
            missionThumbnail={DonationPostDetails.missionThumbnail}
            title={DonationPostDetails.title}
          />

          <DonationInfo
            mission={DonationPostDetails.DonationInfo[0].mission}
            organizer={DonationPostDetails.organizer}
            update={DonationPostDetails.DonationInfo[0].updateText}
            updateDate={DonationPostDetails.DonationInfo[0].updated}
            updateImages={DonationPostDetails.DonationInfo[0].updateImages}
          />
          {/** 
            <WordsOfSupport
            amount={DonatedAmounts}
            description={Descriptions}
            supporters={Supporters}
          />
          */}
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
