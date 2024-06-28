import type { FC, ReactNode, SyntheticEvent} from 'react';
import { useEffect, useState } from 'react';



import { Modal, Button, Card } from '@good/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import Image from 'next/image';
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
  }

  const handleClose = () => {
    setShowModal(false);
  }
  
  const handleCopyLink = async () => {
    try {
      const urlToCopy = window.location.href;
      await navigator.clipboard.writeText(urlToCopy);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

const handleWhatsApp = () => {
};

const handleMessenger = () => {
};

const handleTwitter = () => {
};

const handlePrintPoster = () => {
};

const handleFacebook = () => {
};

const handleEmail = () => {
};

const handleNextDoor = () => {
};

const handleQRCode = () => {
};

const handleWebsiteWidget = () => {
};


const modalContent = (
  <Card className="rounded-b-xl rounded-t-none border-none">
    <div className="flex">
      {/* Left Column */}
      <div className="w-1/2 bg-white dark:bg-black">
        <div className="ml-5 mr-5">
          <div className="flex flex-col pt-5 items-center justify-center">
            <div className="flex flex-col items-left text-center text-md mt-5 mb-5">
              <div className="flex items-center cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleCopyLink}>
                <Image src={link} alt="Link" width={50} height={50} />
                <span className="ml-5">Copy Link</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleWhatsApp}>
                <Image src={whatsApp} alt="WhatsApp" width={50} height={50} />
                <span className="ml-5">WhatsApp</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleMessenger}>
                <Image src={messenger} alt="Messenger" width={50} height={50} />
                <span className="ml-5">Messenger</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleTwitter}>
                <div className="bg-white rounded-full">
                  <Image src={twitter} alt="Twitter" width={50} height={50} />
                </div>
                <span className="ml-5">Twitter</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handlePrintPoster}>
                <Image src={printer} alt="Printer" width={50} height={50} />
                <span className="ml-5">Print Poster</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-1/2 bg-white dark:bg-black">
        <div className="ml-5 mr-5">
          <div className="flex flex-col pt-5 items-center justify-center">
            <div className="flex flex-col items-left text-center text-md mt-5 mb-5">
              <div className="flex items-center cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleFacebook}>
                <Image src={facebook} alt="Facebook" width={50} height={50} />
                <span className="ml-5">Facebook</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleEmail}>
                <Image src={mail} alt="Mail" width={50} height={50} />
                <span className="ml-5">Email</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleNextDoor}>
                <Image src={nextDoor} alt="Next Door" width={50} height={50} />
                <span className="ml-5">Nextdoor</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleQRCode}>
                <div className="bg-white rounded-full">
                  <Image src={qr} alt="QR" width={50} height={50} />
                </div>
                <span className="ml-5">QR Code</span>
              </div>
              <div className="flex items-center mt-5 cursor-pointer hover:bg-gray-500 rounded-lg p-2" onClick={handleWebsiteWidget}>
                <Image src={bubbleChat} alt="Bubble Chat" width={50} height={50} />
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
    style={{ background: '#de78ab' }}
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
