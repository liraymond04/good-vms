import type { FC } from 'react';

import { OpenAction } from '@good/data/enums';
import isFeatureAvailable from '@helpers/isFeatureAvailable';
import {
  BanknotesIcon,
  BuildingStorefrontIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import {
  ScreenType,
  useOpenActionStore
} from 'src/store/non-persisted/publication/useOpenActionStore';

import OpenActionItem from './OpenActionItem';
import OpenActionsConfig from './OpenActionsConfig';
import SaveOrCancel from './SaveOrCancel';

const OpenActionsList: FC = () => {
  const { screen, selectedOpenAction, setShowModal } = useOpenActionStore();

  return screen === ScreenType.List ? (
    <div className="p-5">
      <div className="mb-5 space-y-3">
        {isFeatureAvailable('rent-ads') ? (
          <OpenActionItem
            description="Place an billboard on your post"
            icon={<BuildingStorefrontIcon className="size-6" />}
            title="Rentable Billboard"
            type={OpenAction.RentableBillboard}
          />
        ) : null}
        <OpenActionItem
          description="Swap any ERC-20 token"
          icon={<BanknotesIcon className="size-6" />}
          title="Token Swap"
          type={OpenAction.Swap}
        />
        <OpenActionItem
          description="Allow referral"
          icon={<BanknotesIcon className="size-6" />}
          title="Referral"
          type={OpenAction.Referral}
        />
        <OpenActionItem
          description="Allow donations"
          icon={<GiftIcon className="size-6" />}
          title="Donations"
          type={OpenAction.Donation}
        />
      </div>
      <SaveOrCancel
        onSave={() => setShowModal(false)}
        saveDisabled={selectedOpenAction === null}
      />
    </div>
  ) : selectedOpenAction ? (
    <OpenActionsConfig />
  ) : null;
};

export default OpenActionsList;
