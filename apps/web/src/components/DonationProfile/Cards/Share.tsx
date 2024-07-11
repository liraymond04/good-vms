import type { FC } from 'react';

import { Card, Modal } from '@good/ui';
import Image from 'next/image';
import { useState } from 'react';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import bubbleChat from './Icons/bubble-chat.png';
import facebook from './Icons/facebook.png';
import link from './Icons/link.png';
import mail from './Icons/mail.png';
import messenger from './Icons/messenger.png';
import nextDoor from './Icons/nextDoor.png';
import printer from './Icons/printer.png';
import qr from './Icons/qr.png';
import twitter from './Icons/twitter.png';
import whatsApp from './Icons/whatsApp.png';

const ShareCard: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCopyLink = async () => {
    try {
      const urlToCopy = window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleWhatsApp = () => {};

  const handleMessenger = () => {};

  const handleTwitter = () => {};

  const handlePrintPoster = () => {};

  const handleFacebook = () => {};

  const handleEmail = () => {};

  const handleNextDoor = () => {};

  const handleQRCode = () => {};

  const handleWebsiteWidget = () => {};

  const modalContent = (
    <Card className="rounded-b-xl rounded-t-none border-none">
      <div className="flex">
        {/* Left Column */}
        <div className="w-1/2 bg-white dark:bg-black">
          <div className="ml-5 mr-5">
            <div className="flex flex-col items-center justify-center pt-5">
              <div className="items-left text-md mb-5 mt-5 flex flex-col text-center">
                <div
                  className="flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleCopyLink}
                >
                  <Image alt="Link" height={50} src={link} width={50} />
                  <span className="ml-5">Copy Link</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleWhatsApp}
                >
                  <Image alt="WhatsApp" height={50} src={whatsApp} width={50} />
                  <span className="ml-5">WhatsApp</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleMessenger}
                >
                  <Image
                    alt="Messenger"
                    height={50}
                    src={messenger}
                    width={50}
                  />
                  <span className="ml-5">Messenger</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleTwitter}
                >
                  <div className="rounded-full bg-white">
                    <Image alt="Twitter" height={50} src={twitter} width={50} />
                  </div>
                  <span className="ml-5">Twitter</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handlePrintPoster}
                >
                  <Image alt="Printer" height={50} src={printer} width={50} />
                  <span className="ml-5">Print Poster</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/2 bg-white dark:bg-black">
          <div className="ml-5 mr-5">
            <div className="flex flex-col items-center justify-center pt-5">
              <div className="items-left text-md mb-5 mt-5 flex flex-col text-center">
                <div
                  className="flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleFacebook}
                >
                  <Image alt="Facebook" height={50} src={facebook} width={50} />
                  <span className="ml-5">Facebook</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleEmail}
                >
                  <Image alt="Mail" height={50} src={mail} width={50} />
                  <span className="ml-5">Email</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleNextDoor}
                >
                  <Image
                    alt="Next Door"
                    height={50}
                    src={nextDoor}
                    width={50}
                  />
                  <span className="ml-5">Nextdoor</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleQRCode}
                >
                  <div className="rounded-full bg-white">
                    <Image alt="QR" height={50} src={qr} width={50} />
                  </div>
                  <span className="ml-5">QR Code</span>
                </div>
                <div
                  className="mt-5 flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-500"
                  onClick={handleWebsiteWidget}
                >
                  <Image
                    alt="Bubble Chat"
                    height={50}
                    src={bubbleChat}
                    width={50}
                  />
                  <span className="ml-5">Website Widget</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
    <button 
    className="w-full rounded-full px-4 py-2 text-sm text-white" 
    style={{ background: '#da5597' }}
    onClick={handleOpen}>
      <span>Share</span>
    </button>
    {showModal && (
      <Modal show={true} onClose={handleClose} title="Help by sharing">
        {modalContent}
      </Modal>
    )}
  </>
  );
};

export default ShareCard;
