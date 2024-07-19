import React, { FC, useState, SyntheticEvent } from 'react';
import { Modal, Button, Card } from '@good/ui';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { useProfileStatus } from 'src/store/non-persisted/useProfileStatus';
import toast from 'react-hot-toast';

import useCreatePublication from 'src/hooks/useCreatePublication';
import usePublicationMetadata from 'src/hooks/usePublicationMetadata';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';



const CreateVolunteerCard: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileStatus();

  const [opportunityName, setOpportunityName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expectedHours, setExpectedHours] = useState<number>(0);
  const [category, setCategory] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>('');

  const {
    publicationContent,
    quotedPublication,
    setPublicationContent,
    setQuotedPublication,
    setTags
  } = usePublicationStore();

  const { addAttachments, attachments, isUploading, setAttachments } =
    usePublicationAttachmentStore((state) => state);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    clearData();
    setShowModal(false);
  };

  const clearData = () => {
    setOpportunityName('');
    setStartDate('');
    setEndDate('');
    setExpectedHours(0);
    setCategory('');
    setWebsite('');
    setDesc('');
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!opportunityName || !startDate || !endDate || !category || !desc) {
      toast.error('All fields must be filled in.');
    } else {
      console.log('Volunteer Name:', opportunityName);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);
      console.log('Expected Hours:', expectedHours);
      console.log('Category:', category);
      console.log('Website:', website);
      console.log('Description:', desc);
      console.log('Image:', imageFile);
      handleClose();
    }
  };


const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
  const { name, value } = event.target;

  switch (name) {
    case 'opportunityName':
      setOpportunityName(value);
      break;
    case 'startDate':
      setStartDate(value);
      break;
    case 'endDate':
      setEndDate(value);
      break;
    case 'expectedHours':
      setExpectedHours(parseInt(value));
      break;
    case 'category':
      setCategory(value);
      break;
    case 'website':
      setWebsite(value);
      break;
    case 'desc':
      setDesc(value);
      break;
    case 'imageFile':
      const fileInput = event.target as HTMLInputElement;
      const file = fileInput.files && fileInput.files[0];

      if (file) {
        setImageFile(file);
        setImageName(file.name);
      } else {
        setImageFile(null);
        setImageName('');
      }
      break;
    default:
      break;
  }
};



  const modalContent = (
    <Card className="w-full !rounded-b-xl !rounded-t-none border-none">
      <div className="ml-5 mr-5">
        <div className="flex flex-col pt-5 items-center justify-center">
          <div className="p-4 flex flex-col items-center justify-center w-full">
            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Volunteer opportunity name</label>
              <input
                type="text"
                name="opportunityName"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Medical Internship"
                value={opportunityName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                value={startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">End Date</label>
              <input
                type="date"
                name="endDate"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                value={endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Expected number of hours</label>
              <input
                type="number" 
                name="expectedHours"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Ex: 5"
                value={expectedHours}
                onChange={handleChange}
                required
                min="0" 
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Category</label>
              <input
                type="text"
                name="category"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="Healthcare"
                value={category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Website (leave empty if not linking to external opportunity)</label>
              <input
                type="text"
                name="website"
                className="border-2 border-black rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                placeholder="https://ecssen.ca/"
                value={website}
                onChange={handleChange}
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Activity Description</label>
              <textarea
                name="desc"
                className="border-2 border-black rounded-lg px-5 py-3 text-black w-full focus:border-pink-500 h-40 resize-none"
                placeholder="Tell us more about this volunteer opportunity"
                value={desc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative w-full mb-5">
              <label className="text-xs dark:text-white text-black">Upload Image</label>
              <input
                type="file"
                accept="image/*" 
                name="imageFile"
                className="border-2 border-black bg-white rounded-full px-5 py-3 text-black w-full focus:border-pink-500"
                onChange={handleChange}
              />
           </div>
          </div>
        </div>

        <div className="divider mx-5" />
        <div className="block items-center px-5 py-3 sm:flex">
          <div className="flex items-center space-x-4"></div>
          <div className="ml-auto mt-2 sm:mt-0">
            <Button className=" rounded-full bg-[#da5597] dark:bg-[#da5597] border border-transparent dark:text-white mr-2 text-white " onClick={handleSubmit}>
              Create
            </Button>
            <Button variant="primary" outline={true} onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <button className="mb-7 mt-2 flex w-min items-center justify-center rounded-full bg-[#da5597] px-2 py-2 text-white focus:outline-none lg:w-full" onClick={handleOpen}>
        <span>Create volunteer opportunity</span>
      </button>
      {showModal && (
        <Modal show={true} onClose={handleClose} title="Create volunteer opportunity">
          {modalContent}
        </Modal>
      )}
    </>
  );
};

export default CreateVolunteerCard;
