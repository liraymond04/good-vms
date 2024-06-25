// pages/donations/[id]/index.tsx

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Leafwatch } from '@helpers/leafwatch';
import { PAGEVIEW } from '@good/data/tracking';
import { GridLayout, GridItemEight, GridItemFour } from '@good/ui';
import Sidebar from '@components/Home/Sidebar';
import DonationMeter from './DonationMeter/DonationMeter';


const DonationDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      Leafwatch.track(PAGEVIEW, { page: `donations/${id}` });
    }
  },  [id]); 

  return (
    <>
      <GridLayout>
        <GridItemEight className="space-y-5">
          <h1 className="relative">Donation ID: {id}</h1>
  
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
