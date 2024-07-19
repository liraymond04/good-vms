import type { FC } from 'react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const NavPost: FC = () => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setShowNewPostModal } = useGlobalModalStateStore();
  const { setPublicationContent } = usePublicationStore();

  const openModal = () => {
    setShowNewPostModal(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      className="mb-7 mt-2 flex w-min items-center justify-center rounded-full bg-[#da5597] px-2 py-2 text-white focus:outline-none lg:w-full"
      onClick={openModal}
      type="button"
    >
      <span className="block text-xl max-[1024px]:hidden">Post</span>
      <PencilSquareIcon className="hidden size-8 max-[1024px]:block" />
    </button>
  );
};

export default NavPost;
