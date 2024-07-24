import type { FC } from 'react';

import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';
import getProfile from '@good/helpers/getProfile';
import { Card, Image } from '@good/ui';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { MenuItem } from '@headlessui/react';
import {UserIcon} from '@heroicons/react/24/outline';
import MoreLink from '../../components/Shared/Navbar/NavItems/MoreLink';

interface CreateVolunteerCardProps {
  tags?: string[];
}

const CreateVolunteerCard: FC<CreateVolunteerCardProps> = ({ tags }) => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setShowNewVolunteerPostModal } = useGlobalModalStateStore();
  const { setPublicationContent, setTags } = usePublicationStore();

  const openModal = () => {
    if (tags) {
      setTags(tags);
    }
    setShowNewVolunteerPostModal(true);
  };

  useEffect(() => {
    if (isReady && query.text) {
      const { hashtags, text, url, via } = query;
      let processedHashtags;

      if (hashtags) {
        processedHashtags = (hashtags as string)
          .split(',')
          .map((tag) => `#${tag} `)
          .join('');
      }

      const content = `${text}${
        processedHashtags ? ` ${processedHashtags} ` : ''
      }${url ? `\n\n${url}` : ''}${via ? `\n\nvia @${via}` : ''}`;

      openModal();
      setPublicationContent(content);
    }
  }, []);

  return (
    <MenuItem
      as="button"  
      onClick={openModal}
      type="button"

    >
          <MoreLink
            onClick={openModal} 
            icon={<UserIcon className="size-4" />}
            text="Volunteer Post"
          />
    </MenuItem>
  );
};

export default CreateVolunteerCard;
