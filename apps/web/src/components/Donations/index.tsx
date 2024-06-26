'use client';
import Footer from '@components/Shared/Footer';
import { GridItemEight, GridItemFour, GridLayout } from '@good/ui';

import DonationsFeed from './DonationsFeed';

const Donations = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-4">
        <div className="text-grey-400 flex gap-4">
          <div className="px-2 py-1">Donations Feed</div>
        </div>
        <DonationsFeed />
        <hr className="my-6 border-gray-300" />
      </GridItemEight>

      <GridItemFour>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Donations;
