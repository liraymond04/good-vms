import type { FC } from 'react';

import { GOOD_API_URL, IS_MAINNET } from '@good/data/constants';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import GoodNft from './GoodNft';
import GoodProfile from './GoodProfile';

interface BadgesProps {
  id: string;
}

const Badges: FC<BadgesProps> = ({ id }) => {
  // Begin: Get isHeyProfile
  const getIsHeyProfile = async (): Promise<boolean> => {
    const response = await axios.get(`${GOOD_API_URL}/badges/isGoodProfile`, {
      params: { id }
    });
    const { data } = response;

    return data?.isGoodProfile || false;
  };

  const { data: isGoodProfile } = useQuery({
    queryFn: getIsHeyProfile,
    queryKey: ['getIsHeyProfile', id]
  });
  // End: Get isGoodProfile

  // Begin: Check has Hey NFT
  const getHasHeyNft = async (): Promise<boolean> => {
    const response = await axios.get(`${GOOD_API_URL}/badges/hasHeyNft`, {
      params: { id }
    });
    const { data } = response;

    return data?.hasHeyNft || false;
  };

  const { data: hasGoodNft } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getHasHeyNft,
    queryKey: ['getHasHeyNft', id]
  });
  // End: Check has Good NFT

  const hasBadges = isGoodProfile || hasGoodNft;

  if (!hasBadges) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="flex flex-wrap gap-3">
        {isGoodProfile && <GoodProfile />}
        {hasGoodNft && <GoodNft />}
      </div>
    </>
  );
};

export default Badges;
