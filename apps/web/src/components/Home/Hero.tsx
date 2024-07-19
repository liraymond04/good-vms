import type { FC } from 'react';

import { APP_NAME } from '@good/data/constants';

const Hero: FC = () => {
  return (
    <div className="bg-hero mb-3 rounded-xl border-b bg-white py-12">
      <div className="container mx-auto max-w-screen-xl px-5">
        <div className="flex w-full items-stretch py-8 text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-3xl font-extrabold sm:text-4xl">
              Welcome to {APP_NAME},
            </div>
            <div className="leading-9 text-gray-900 dark:text-gray-300">
              <h3>An open social media for the public good</h3>
              <h3>built on Lens Protocol and hey.xyz.</h3>
            </div>
          </div>
          <div className="hidden w-full flex-1 flex-shrink-0 sm:block" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
