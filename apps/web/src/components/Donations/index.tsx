// pages/donations/[id]/index.tsx

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Leafwatch } from '@helpers/leafwatch';
import { PAGEVIEW } from '@good/data/tracking';
import { GridLayout, GridItemEight, GridItemFour } from '@good/ui';
import DonationMeter from './DonationComponents/DonationMeter';
import DonationThumbnail from './DonationComponents/DonationThumbnail';
import DonationInfo from './DonationComponents/DonationInfo';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import WordsOfSupport from './DonationComponents/WordsOfSupport';


const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { currentProfile } = useProfileStore();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      Leafwatch.track(PAGEVIEW, { page: `donations/${id}` });
    }
  },  [id]); 
  

  const DonationPostDetails = {
    title: 'Food Bank',
    missionThumbnail: "https://globalnews.ca/wp-content/uploads/2020/11/South-Delta-Food-Bank-food-in-bags.jpg?quality=85&strip=all",
    organizer: currentProfile, //this will be profile of the donations post creator
    DonationInfo: [
      {
        mission: "Body text of donation post, explains purpose of the donation/cause",
        updated: new Date(), // date of donations post updates
        updateText: "Text for any updates to the donations post, accompanied by the date it was updated",
        updateImages: [
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300"
        ] //any images for the updates, can be null. Images displayed in a 3 columns layout
      }
    ],
    DonatedAmount: [
      {
        goal: 1000,
        current: 200
      }
    ]
  };
  
  const Supporters: Profile[] = [
   currentProfile,
   currentProfile,
   currentProfile
  ];
  
  const DonatedAmounts: number[] = [100, 50, 200]; 
  
  const Descriptions: string[] = [
    'Thank you for your supporting those in need',
    'Thank you for your care',
    'Thank you for preparing meals'
  ];

  return (
    <>
    {/**apps\web\src\components\Publication\FullPublication.tsx regular user post reference */}
    <GridLayout>
        <GridItemEight className="space-y-5">
          {/* Donation Thumbnail Component */}
          <DonationThumbnail
            title={DonationPostDetails.title}
            missionThumbnail={DonationPostDetails.missionThumbnail}
          />

          {/* Donation Info Component */}
          <DonationInfo
            organizer={DonationPostDetails.organizer}
            mission={DonationPostDetails.DonationInfo[0].mission}
            update={DonationPostDetails.DonationInfo[0].updateText}
            updateDate={DonationPostDetails.DonationInfo[0].updated}
            updateImages={DonationPostDetails.DonationInfo[0].updateImages}
          />
          <WordsOfSupport
            supporters = {Supporters}
            amount = {DonatedAmounts}
            description={Descriptions}
            />
        </GridItemEight>

        <GridItemFour>
          {/* Donation Meter Component */}
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
