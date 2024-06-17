import type { FC } from 'react';

import { AUTH } from '@good/data/tracking';
import { Button } from '@good/ui';
import cn from '@good/ui/cn';
import { Leafwatch } from '@helpers/leafwatch';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface LoginButtonProps {
  className?: string;
  isBig?: boolean;
  isFullWidth?: boolean;
  title?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  className = '',
  isBig = false,
  isFullWidth = false,
  title = 'Login'
}) => {
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <Button
    className={
      'inline-flex items-center justify-center rounded-full border border-white bg-black text-white w-full p-2 mb-2 text-base' 
    }
      onClick={(e) => {
        e.stopPropagation();
        setShowAuthModal(true);
        Leafwatch.track(AUTH.OPEN_LOGIN);
      }}
      size={isBig ? 'lg' : 'md'}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
