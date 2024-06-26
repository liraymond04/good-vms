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


const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { currentProfile } = useProfileStore();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      Leafwatch.track(PAGEVIEW, { page: `donations/${id}` });
    }
  },  [id]); 
  

  return (
    <>
    {/**apps\web\src\components\Publication\FullPublication.tsx regular user post reference */}
      <GridLayout>
      <GridItemEight className="space-y-5">
        <DonationThumbnail
          title="Food Bank"
          missionThumbnail="https://globalnews.ca/wp-content/uploads/2020/11/South-Delta-Food-Bank-food-in-bags.jpg?quality=85&strip=all"
        />
        <DonationInfo 
        organizer={currentProfile}
        mission="Lorem ipsum dolor sit amet,
         consectetur adipiscing elit. Sed dapibus fringilla ligula, 
         eget feugiat eros dictum at. Class aptent taciti sociosqu ad 
         litora torquent per conubianostra, per inceptos himenaeos. In commodo erat sit amet ex condimentum, 
         vel pharetra tellus ultricies. Maecenas a nisl purus. Proin et felis in  risus rhoncus commodo vel ut arcu.
          In condimentum erat ac libero sollicitudin blandit."

        update="Sed sit amet est sed libero finibus aliquam sed vel eros. 
          Ut vulputate mollis molestie. Aenean ornare fringilla urna, ut 
          venenatis tellus tempus ut. Duis id nunc laoreet, interdum nulla congue, 
          commodo justo. In efficitur nulla eu ultricies pulvinar. Fusce suscipit 
          ut ex vitae vulputate. " 

        updateDate = { new Date(8.64) }

        updateImages={[
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300",
          "https://picsum.photos/200/300"
        ]}/>

      </GridItemEight>
        <GridItemFour>
        <DonationMeter
            goal={1000}
            total={200}        
            />
        </GridItemFour>
      </GridLayout>
      <div className="App">
    </div>   
    </>
  );
};

export default DonationDetails;
