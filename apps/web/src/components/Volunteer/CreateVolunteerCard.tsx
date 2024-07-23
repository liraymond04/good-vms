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
    <button
    className="mb-7 mt-2 flex w-min items-center justify-center rounded-full bg-[#da5597] px-2 py-2 text-white focus:outline-none lg:w-full"
    onClick={() => openModal()}
    type="button"
  >
    <span className="block text-xl max-[1024px]:hidden">Volunteer Post</span>
    <PencilSquareIcon className="hidden size-8 max-[1024px]:block" />
  </button>
  );
};

export default CreateVolunteerCard;
