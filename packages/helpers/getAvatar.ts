import { AVATAR } from '@good/data/constants';

import getLennyURL from './getLennyURL';
import imageKit from './imageKit';
import sanitizeDStorageUrl from './sanitizeDStorageUrl';

const getAvatar = (profile: any, namedTransform = AVATAR): string => {
  if (!profile?.id) {
    // Handle case where profile ID is null or undefined
    return getLennyURL('default'); // Return a default image URL or placeholder
  }

  const avatarUrl =
    // Lens NFT Avatar fallbacks
    profile?.metadata?.picture?.image?.optimized?.uri ||
    profile?.metadata?.picture?.image?.raw?.uri ||
    // Lens Profile Avatar fallbacks
    profile?.metadata?.picture?.optimized?.uri ||
    profile?.metadata?.picture?.raw?.uri ||
    // Stamp.fyi Avatar fallbacks
    getLennyURL(profile.id);

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
};

export default getAvatar;
