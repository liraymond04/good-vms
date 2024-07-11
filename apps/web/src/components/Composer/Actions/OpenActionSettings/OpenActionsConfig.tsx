import type { FC } from 'react';

import { OpenAction } from '@good/data/enums';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';

import DonationConfig from './Config/GoodDonation';
import GoodReferralConfig from './Config/GoodReferral';
import SwapConfig from './Config/Swap';

const OpenActionsConfig: FC = () => {
  const { selectedOpenAction } = useOpenActionStore();

  return (
    <div>
      {selectedOpenAction === OpenAction.Swap && <SwapConfig />}
      {selectedOpenAction === OpenAction.Referral && <GoodReferralConfig />}
      {selectedOpenAction === OpenAction.Donation && <DonationConfig />}
    </div>
  );
};

export default OpenActionsConfig;
