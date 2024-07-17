import type { MarkupLinkProps } from '@good/types/misc';
import type { FC } from 'react';

import ClubPreview from '@components/Shared/ClubPreview';
import { CLUB_HANDLE_PREFIX } from '@good/data/constants';
import { PUBLICATION } from '@good/data/tracking';
import stopEventPropagation from '@good/helpers/stopEventPropagation';
import { Leafwatch } from '@helpers/leafwatch';
import Link from 'next/link';

const Club: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const club = title.slice(1).replace(CLUB_HANDLE_PREFIX, '').toLowerCase();
  const clubHandle = `/${club}`;

  return (
    <Link
      className="cursor-pointer outline-none focus:underline"
      href={`/c/${club}`}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_CLUB, { club: clubHandle });
      }}
    >
      <ClubPreview handle={club}>{clubHandle}</ClubPreview>
    </Link>
  );
};

export default Club;
