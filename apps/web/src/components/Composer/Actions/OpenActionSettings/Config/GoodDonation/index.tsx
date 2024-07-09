import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GoodDonation } from '@good/abis';
import { GOOD_DONATION } from '@good/data/constants';
import { type FC } from 'react';
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
  const { setOpenAction, setShowModal } = useOpenActionStore();
  const { enabled, setEnabled } = useDonationActionStore();
  const { address } = useAccount();

  const { data, error, isError, isLoading } = useReadContract({
    abi: GoodDonation,
    address: GOOD_DONATION,
    args: [address!],
    functionName: 'isVerifiedDonee',
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
    setOpenAction({ address: GOOD_DONATION, data: '0x00' });
    setShowModal(false);
  };

  return (
    <div className="p-5">
      <ToggleWithHelper
        description="Donation lets users to donate on your post"
        disabled={!isVerifiedOrganization || isError || isLoading}
        heading="Enable donations"
        on={enabled}
        setOn={() => {
          if (!enabled) {
            onSave();
          }
          setEnabled(!enabled);
        }}
      />
      {!(isLoading || isError) && !isVerifiedOrganization && (
        <span className="text-sm font-bold text-red-500">
          Only verified organizations can create donation posts!
        </span>
      )}
    </div>
  );
};

export default DonationConfig;
