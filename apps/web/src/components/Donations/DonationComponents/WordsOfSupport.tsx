import React, { useState } from 'react';
import styled from 'styled-components'; 
import { Profile } from '@good/lens';
import { Image } from '@good/ui';
import { Button } from '@headlessui/react';
import getAvatar from '@good/helpers/getAvatar';

interface WordsOfSupportProps {
  supporters: Profile[];
  amount: number[]; 
  description: string[]; 
}

const WordsOfSupport: React.FC<WordsOfSupportProps> = ({ supporters, amount, description }) => {
  const [showAllSupporters, setShowSupports] = useState(false);

  const maxLength = Math.min(supporters.length, amount.length, description.length);

  const handleShowAllSupporters = () => {
    setShowSupports(true);
  };

  return (
    <div className="rounded items-center justify-center -top-10">
      <div className='mb-5 text-lg'>
        Words of Support:
      </div>
      {Array.from({ length: showAllSupporters ? supporters.length : maxLength }, (_, index) => (
        <div key={index} className="supporter-details flex flex-col">
          <div className="flex">
            <Image          
              src={getAvatar(supporters[index])}
              alt={supporters[index]?.id}
              className="size-12 cursor-pointer rounded-full border dark:border-gray-700"
            />
            <div className="ml-4 mb-5">
              <p>{supporters[index]?.handle?.localName}</p>
              <p>${amount[index]}</p>
              <p className="description">{description[index]}</p>
            </div>
          </div>
        </div>
      ))}
      {!showAllSupporters && (
        <div className="flex mt-5 justify-center items-center">
           <Button 
            style={{ background: '#da5597' }} 
            className="items-center w-1/3 justify-center rounded-full py-2 px-4 text-lg text-white"
            onClick={handleShowAllSupporters}>
            Show All
          </Button>
        </div>
      )}
    </div>
  );
};

export default WordsOfSupport;
