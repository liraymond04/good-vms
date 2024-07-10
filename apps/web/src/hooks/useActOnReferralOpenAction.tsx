import type { Address } from 'viem';

import { GOOD_REFERRAL } from '@good/data/constants';
import { encodeAbiParameters } from 'viem';

import type { CreatePublicationProps } from './useActOnUnknownOpenAction';

import useActOnUnknownOpenAction from './useActOnUnknownOpenAction';

export interface DonationData {
  amount: bigint; // uint256
  tokenAddress: `0x${string}`; // address
}

const useActOnReferralOpenAction = (
  params: {
    publicationId: string;
    referrers: Address[];
  } & CreatePublicationProps
) => {
  const { actOnUnknownOpenAction, isLoading, txHash, txId } =
    useActOnUnknownOpenAction(params);

  const makeDonation = (data: DonationData) => {
    const d = encodeAbiParameters(
      [
        { name: 'tokenAddress', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      [data.tokenAddress, data.amount]
    );

    if (params.referrers.length === 0) {
      // console.log('no referrers found');
      return;
    }

    return actOnUnknownOpenAction({
      address: GOOD_REFERRAL,
      data: d,
      publicationId: params.publicationId,
      referrers: params.referrers
        .slice(Math.max(1, params.referrers.length - 3))
        .map((referrer) => ({ profileId: referrer }))
    });
  };

  return { isLoading, makeDonation, txHash, txId };
};

export default useActOnReferralOpenAction;
