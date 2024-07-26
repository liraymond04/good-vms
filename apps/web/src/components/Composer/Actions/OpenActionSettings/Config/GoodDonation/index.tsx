import SaveOrCancel from '@components/Composer/Actions/OpenActionSettings/SaveOrCancel';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GoodOrganizationStore } from '@good/abis';
import { GOOD_DONATION, GOOD_ORGANIZATION_STORE } from '@good/data/constants';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { useAccount, useReadContract } from 'wagmi';
import { create } from 'zustand';

interface State {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const store = create<State>((set) => ({
  enabled: false,
  setEnabled: (enabled) => set({ enabled })
}));

export const useDonationActionStore = createTrackedSelector(store);

const DonationConfig: FC = () => {
  const { address } = useAccount();
  const { resetOpenAction, setOpenAction, setShowModal } = useOpenActionStore();
  const { enabled, setEnabled } = useDonationActionStore();
  const [toggleOn, setToggleOn] = useState(enabled);

  const { data, error, isError, isLoading } = useReadContract({
    abi: GoodOrganizationStore,
    address: GOOD_ORGANIZATION_STORE,
    args: [address!],
    functionName: 'isOrganization',
    query: {
      enabled: !!address,
      staleTime: 1 * 60 * 1000
    }
  });

  if (isError) {
    toast.error(`Failed to retrieve verified organization status.`);
    console.error(`Failed to retrieve verified organization status: ${error}`);
  }

  const isVerifiedOrganization = !!data;

  const onSave = () => {
    if (toggleOn) {
      setOpenAction({ address: GOOD_DONATION, data: '0x00' });
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
          description="Donation lets users to donate on your post"
          disabled={!isVerifiedOrganization || isError || isLoading}
          heading="Enable donations"
          on={toggleOn}
          setOn={setToggleOn}
        />
        {!(isLoading || isError) && !isVerifiedOrganization && (
          <span className="text-sm font-bold text-red-500">
            Only verified organizations can create donation posts!
          </span>
        )}
      </div>
      <div className="divider" />
      <div className="m-5">
        <SaveOrCancel onSave={onSave} saveDisabled={enabled === toggleOn} />
      </div>
    </>
  );
};

export default DonationConfig;
