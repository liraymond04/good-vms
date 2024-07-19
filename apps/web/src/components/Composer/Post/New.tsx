import type { FC } from 'react';

import getAvatar from '@good/helpers/getAvatar';
import getLennyURL from '@good/helpers/getLennyURL';
import getProfile from '@good/helpers/getProfile';
import { Card, Image } from '@good/ui';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface NewPostProps {
  tags?: string[];
}

const NewPost: FC<NewPostProps> = ({ tags }) => {
  const { isReady, push, query } = useRouter();
  const { currentProfile } = useProfileStore();
  const { setScreen, setShowAuthModal, setShowNewPostModal } = useGlobalModalStateStore();
  const { setPublicationContent, setTags } = usePublicationStore();

  const openModal = useCallback(() => {
    if (tags) {
      setTags(tags);
    }
    setShowNewPostModal(true);
  }, [setTags, setShowNewPostModal, tags]);

  useEffect(() => {
    if (isReady && query.text) {
      if (!currentProfile?.id) {
        // Open login modal if no profile ID
        setScreen('choose');
        setShowAuthModal(true, 'login');
        return;
      }

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
  }, [
    isReady,
    query,
    currentProfile,
    setPublicationContent,
    setTags,
    openModal,
    setScreen,
    setShowAuthModal
  ]);

  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center space-x-3">
        <Image
          alt={currentProfile?.id || 'default'}
          className="size-11 cursor-pointer rounded-full border bg-gray-200 dark:border-gray-700"
          height={44}
          onClick={() => {
            if (currentProfile?.id) {
              push(getProfile(currentProfile).link);
            } else {
              setScreen('choose');
              setShowAuthModal(true, 'login');
            }
          }}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(currentProfile?.id || 'default');
          }}
          src={getAvatar(currentProfile)}
          width={44}
        />
        <button
          className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          onClick={() => openModal()}
          type="button"
        >
          <PencilSquareIcon className="size-5" />
          <span>What's new?!</span>
        </button>
      </div>
    </Card>
  );
};

export default NewPost;
