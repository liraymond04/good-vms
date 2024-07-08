import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GOOD_REFERRAL } from '@good/data/constants';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { create } from 'zustand';

interface State {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const store = create<State>((set) => ({
  enabled: false,
  setEnabled: (enabled) => set({ enabled })
}));

export const useReferralActionStore = createTrackedSelector(store);

const ReferralConfig: FC = () => {
  const { openAction, setOpenAction, setShowModal } = useOpenActionStore();

  const onSave = () => {
    setOpenAction({ address: GOOD_REFERRAL, data: '0x00' });
    console.log(openAction);
    setShowModal(false);
  };

  const { enabled, setEnabled } = useReferralActionStore();

  return (
    <div className="p-5">
      <ToggleWithHelper
        description="Referral description"
        heading="Enable referral"
        on={enabled}
        setOn={() => {
          if (!enabled) {
            console.log('set enabled, doing save');
            onSave();
          }
          setEnabled(!enabled);
        }}
      />
    </div>
  );
};

export default ReferralConfig;
