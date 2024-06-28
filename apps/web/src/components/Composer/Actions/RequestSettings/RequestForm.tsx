import type { FC } from 'react';

import { Button } from '@good/ui';
import React, { useRef, useState } from 'react';

import type { PropsHandle } from './getProfile';
import type { FieldMetadata } from './InputField';

import getProfile from './getProfile';
import { InputField } from './InputField';
import { useDeprecatedAnimatedState } from 'framer-motion';

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
  invalidNumber: 'Enter a positive number with at most 2 decimal places.',
  invalidTransactionURL:
    'URL must link to a transaction on polygonscan.com. Ex. polygonscan.com/tx/<hash>',
  invalidURL: 'Invalid URL.',
  lensIdNotFound: 'Lens ID not found.',
  requiredIfVHR: 'This field is required if Volunteer Hours is filled.',
  requiredNotFilled: 'This field is required.'
};

const regexValidation = {
  number: RegExp(/^\d+(\.\d{1,2})?$/),
  transactionURL: RegExp(
    /^(https?:\/\/)?([\w-]+\.)?polygonscan\.com\/tx\/0x[\da-f]{64}$/i
  ),
  URL: RegExp(/^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/.*)?$/i)
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

const DebugFormState: FC<{ errors: any; formData: any }> = ({
  errors,
  formData
}) => (
  <div className="mt-4 rounded-md border bg-gray-50 p-4">
    <h3 className="text-sm font-medium text-gray-700">Form Data</h3>
    <pre className="overflow-x-auto text-xs text-gray-600">
      {JSON.stringify(formData, null, 2)}
    </pre>
    <h3 className="mt-2 text-sm font-medium text-gray-700">Errors</h3>
    <pre className="overflow-x-auto text-xs text-gray-600">
      {JSON.stringify(errors, null, 2)}
    </pre>
  </div>
);

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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successful, setSuccessful] = useState<boolean>(false);

  // Store field metadata
  const fieldMetadataRef = useRef<FieldMetadata[]>([]);

  // Register field metadata
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

  // Check form requirements and input
  const handleSubmit = async () => {
    setIsLoading(true);
    const newErrors: Partial<FormFields> = {};

    for (const field of fieldMetadataRef.current) {
      const value = formData[field.name as keyof FormFields];

      // Validate required fields
      if (field.isRequired && !value) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.requiredNotFilled;
        continue;
      }

      // Validate number fields
      if (field.isNumber && value && !regexValidation.number.test(value)) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.invalidNumber;
        continue;
      }

      // Validate URL fields
      if (field.isURL && value && !regexValidation.URL.test(value)) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.invalidURL;
        continue;
      }

      // Validate Transaction URL fields
      if (
        field.name === 'transactionURL' &&
        value &&
        !regexValidation.transactionURL.test(value)
      ) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.invalidTransactionURL;
        continue;
      }

      // Validate Lens ID fields
      if (field.isLensID && value && !(await checkLensID(value))) {
        newErrors[field.name as keyof FormFields] =
          inputErrorMessages.lensIdNotFound;
        continue;
      }
    }

    // Check if both donationAmount and volunteerHours are empty
    if (!formData.donationAmount && !formData.volunteerHours) {
      newErrors.donationAmount = inputErrorMessages.donationOrHours;
      newErrors.volunteerHours = inputErrorMessages.donationOrHours;
    }

    // Check evidenceURL is required if volunteerHours is filled
    if (formData.volunteerHours && !formData.evidenceURL) {
      newErrors.evidenceURL = inputErrorMessages.requiredIfVHR;
    }

    // Set errors only if there are any
    if (Object.keys(newErrors).length > 0) {
      setSuccessful(false);
      setErrors(newErrors);
    } else {
      setSuccessful(true);
      console.info('submission successful!');
      setErrors({});
    }

    setIsLoading(false);
    return;
  };

  // Clear form if reject
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
          placeholder="https://polygonscan.com/tx/0x..."
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
        <Button disabled={isLoading} onClick={handleSubmit}>
          Approve
        </Button>
      </div>
      {successful && (
        <p className="mt-2 text-right text-sm text-green-500">
          Information successfully embedded!
        </p>
      )}
      <DebugFormState errors={errors} formData={formData} />
    </div>
  );
};

export default RequestForm;
