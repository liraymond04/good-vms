import SaveOrCancel from '@components/Composer/Actions/OpenActionSettings/SaveOrCancel';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GOOD_REFERRAL } from '@good/data/constants';
import { type FC, useState } from 'react';
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
  const { resetOpenAction, setOpenAction, setShowModal } = useOpenActionStore();
  const { enabled, setEnabled } = useReferralActionStore();
  const [toggleOn, setToggleOn] = useState(enabled);

  const onSave = () => {
    if (toggleOn) {
      setOpenAction({ address: GOOD_REFERRAL, data: '0x00' });
    } else {
      resetOpenAction();
    }

    setEnabled(toggleOn);
    setShowModal(false);
  };

  return (
    <>
      <div className="p-5">
        <ToggleWithHelper
          description="Referral lets users to reward referrers of your post"
          heading="Enable referral"
          on={toggleOn}
          setOn={setToggleOn}
        />
      </div>
      <div className="divider" />
      <div className="m-5">
        <SaveOrCancel onSave={onSave} saveDisabled={enabled === toggleOn} />
      </div>
    </>
  );
};

export default ReferralConfig;
