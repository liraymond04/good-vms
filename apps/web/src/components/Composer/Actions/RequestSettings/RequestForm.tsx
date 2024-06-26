import type { FC } from 'react';

import { Button } from '@good/ui';
import React, { useRef, useState } from 'react';

import type { PropsHandle } from './getProfile';
import type { FieldMetadata } from './InputField';

import getProfile from './getProfile';
import { InputField } from './InputField';

interface FormFields {
  description: string;
  donationAmount: string;
  donorProfileID: string;
  evidenceURL: string;
  organizationName: string;
  projectURL: string;
  transactionURL: string;
  volunteerHours: string;
}

const inputErrorMessages = {
  donationOrHours:
    'One or both of Donation Amount or Volunteer Hours must be filled.',
  isLensID: 'Lens ID not found.',
  isNumber: 'Enter a number with at most 2 decimal places.',
  isRequired: 'This field is required.',
  isRequiredIfVHR: 'This field is required if Volunteer Hours is filled.',
  isURL: 'Invalid URL.'
};

const regexValidation = {
  number: RegExp(/^\d+(\.\d{0,2})?$/),
  URL: RegExp(/[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~-]*)/gi)
};

const checkLensID = async (lensID: string): Promise<boolean> => {
  const root = 'lens';
  const formattedLensID = `${root}/${lensID}`;
  try {
    const profile = await getProfile({
      handle: formattedLensID
    } as PropsHandle);
    return profile ? true : false;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return false;
  }
};

const RequestForm: FC = () => {
  const emptyForm: FormFields = {
    description: '',
    donationAmount: '',
    donorProfileID: '',
    evidenceURL: '',
    organizationName: '',
    projectURL: '',
    transactionURL: '',
    volunteerHours: ''
  };

  const [formData, setFormData] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormFields>>({});

  const fieldMetadataRef = useRef<FieldMetadata[]>([]);

  const registerField = (metadata: FieldMetadata) => {
    fieldMetadataRef.current = [
      ...fieldMetadataRef.current.filter(
        (field) => field.name !== metadata.name
      ),
      metadata
    ];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    const newErrors: Partial<FormFields> = {};

    for (const field of fieldMetadataRef.current) {
      const value = formData[field.name as keyof FormFields];

      if (field.isRequired && !value) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.isRequired;
      }

      if (field.isNumber && value && !regexValidation.number.test(value)) {
        newErrors[field.name as keyof FormFields] = inputErrorMessages.isNumber;
      }

      if (field.isURL && value && !regexValidation.URL.test(value)) {
        newErrors[field.name as keyof FormFields] = inputErrorMessages.isURL;
      }

      if (field.isLensID && value && !(await checkLensID(value))) {
        newErrors[field.name as keyof FormFields] = inputErrorMessages.isLensID;
      }
    }

    // Check if both donationAmount and volunteerHours are empty
    if (!formData.donationAmount && !formData.volunteerHours) {
      newErrors.donationAmount = inputErrorMessages.donationOrHours;
      newErrors.volunteerHours = inputErrorMessages.donationOrHours;
    }

    // Check if evidenceURL is required if volunteerHours is filled
    if (formData.volunteerHours && !formData.evidenceURL) {
      newErrors.evidenceURL = inputErrorMessages.isRequiredIfVHR;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('submission successful!');
    }
  };

  const handleReject = () => {
    setFormData(emptyForm);
    setErrors({});
    fieldMetadataRef.current = [];
  };

  return (
    <div className="mx-auto mt-3">
      <div className="space-y-4">
        <InputField
          errorMessage={errors.organizationName}
          isLensID
          isRequired
          label="Organization Name"
          name="organizationName"
          onChange={handleChange}
          placeholder="@handle"
          register={registerField}
          type="text"
          value={formData.organizationName}
        />
        <InputField
          errorMessage={errors.donorProfileID}
          isLensID
          label="Donor's Profile ID (only if made by organization)"
          name="donorProfileID"
          onChange={handleChange}
          placeholder="@handle"
          register={registerField}
          type="text"
          value={formData.donorProfileID}
        />
        <InputField
          errorMessage={errors.donationAmount}
          isNumber
          label="Donation Amount"
          name="donationAmount"
          onChange={handleChange}
          placeholder="$1 - $1,000"
          register={registerField}
          type="text"
          value={formData.donationAmount}
        />
        {/* LINK ASSOCIATED WITH ACCOUNT MAKING POST */}
        <InputField
          errorMessage={errors.transactionURL}
          isURL
          label="Transaction URL"
          name="transactionURL"
          onChange={handleChange}
          placeholder="https://example.com"
          register={registerField}
          type="text"
          value={formData.transactionURL}
        />
        <InputField
          errorMessage={errors.projectURL}
          isURL
          label="Project or Cause URL"
          name="projectURL"
          onChange={handleChange}
          placeholder="https://example.com"
          register={registerField}
          type="text"
          value={formData.projectURL}
        />
        <InputField
          errorMessage={errors.volunteerHours}
          isNumber
          label="Volunteer Hours"
          name="volunteerHours"
          onChange={handleChange}
          placeholder="enter hours"
          register={registerField}
          type="text"
          value={formData.volunteerHours}
        />
        <InputField
          errorMessage={errors.evidenceURL}
          isURL
          label="Evidence of Volunteer Activities URL"
          name="evidenceURL"
          onChange={handleChange}
          placeholder="https://example.com"
          register={registerField}
          type="text"
          value={formData.evidenceURL}
        />
        <InputField
          errorMessage={errors.description}
          isRequired
          label="Description"
          name="description"
          onChange={handleChange}
          placeholder="description of your activities"
          register={registerField}
          type="textarea"
          value={formData.description}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <Button className="ml-auto" onClick={handleReject} variant="danger">
          Reject
        </Button>
        <Button onClick={handleSubmit}>Approve</Button>
      </div>
    </div>
  );
};

export default RequestForm;
