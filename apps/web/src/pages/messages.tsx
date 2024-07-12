import Messages from '@components/Messages';
import { reactionContentTypeConfig, XMTPProvider } from '@xmtp/react-sdk';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import NotLoggedIn from '@components/Shared/NotLoggedIn';


import Custom404 from './404';

const contentTypeConfigs = [reactionContentTypeConfig];

const XMTPMessages = () => {
  const { currentProfile } = useProfileStore();

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
      <Messages />
    </XMTPProvider>
  );
};

export default XMTPMessages;
