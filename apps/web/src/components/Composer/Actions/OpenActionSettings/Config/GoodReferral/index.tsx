import SaveOrCancel from '@components/Composer/Actions/OpenActionSettings/SaveOrCancel';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { GOOD_REFERRAL, STATIC_IMAGES_URL } from '@good/data/constants';
import { Input, Select } from '@good/ui';
import { type FC, useState } from 'react';
import { createTrackedSelector } from 'react-tracked';
import { useOpenActionStore } from 'src/store/non-persisted/publication/useOpenActionStore';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { type Address, encodeAbiParameters } from 'viem';
import { create } from 'zustand';

interface State {
  amount: number;
  enabled: boolean;
  setAmount: (amount: number) => void;
  setEnabled: (enabled: boolean) => void;
  setTokenAddress: (addr: Address) => void;
  tokenAddress: Address;
}

const store = create<State>((set) => ({
  amount: 1,
  enabled: false,
  setAmount: (amount) => set({ amount }),
  setEnabled: (enabled) => set({ enabled }),
  setTokenAddress: (addr) => set({ tokenAddress: addr }),
  tokenAddress: '0x2d4139144F9Dc09C4A97Dd1fFA83acAf60ff275E' // GOOD
}));

export const useReferralActionStore = createTrackedSelector(store);

const ReferralConfig: FC = () => {
  const { allowedTokens } = useAllowedTokensStore();
  const { resetOpenAction, setOpenAction, setShowModal } = useOpenActionStore();
  const {
    amount,
    enabled,
    setAmount,
    setEnabled,
    setTokenAddress,
    tokenAddress
  } = useReferralActionStore();
  const [toggleOn, setToggleOn] = useState(enabled);

  const onSave = () => {
    if (toggleOn) {
      try {
        const data = encodeAbiParameters(
          [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          [tokenAddress, BigInt(amount)]
        );
        setOpenAction({ address: GOOD_REFERRAL, data });
      } catch (error) {
        console.error(error);
      }
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
        {toggleOn && (
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              max="100000"
              min="1"
              onChange={(event) => {
                setAmount(event.target.valueAsNumber);
              }}
              placeholder="1"
              step={1}
              type="number"
              value={amount}
            />
            <div className="w-5/6">
              <div className="label">Select currency</div>
              <Select
                iconClassName="size-4"
                onChange={(value) => {
                  setTokenAddress(value);
                }}
                options={allowedTokens?.map((token) => ({
                  icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
                  label: token.name,
                  selected: token.contractAddress === tokenAddress,
                  value: token.contractAddress
                }))}
              />
            </div>
          </div>
        )}
      </div>
      <div className="divider" />
      <div className="m-5">
        <SaveOrCancel onSave={onSave} saveDisabled={enabled === toggleOn} />
      </div>
    </>
  );
};

export default ReferralConfig;
