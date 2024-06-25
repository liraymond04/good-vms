import type { FC } from 'react';

import { Button } from '@good/ui';
import { useState } from 'react';

import type { FormFields } from './InputField';

import { InputField } from './InputField';

const inputErrorMessages = {
  donationOrHours:
    'One or both of Donation Amount or Volunteer Hours must be filled.',
  isNumber: 'Enter a number with at most 2 decimal places.',
  isRequired: 'This field is required.',
  isRequiredIfVHR: 'This field is required if Volunteer Hours is filled.',
  isURL: 'Invalid URL.'
};

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

const DebugFormState: FC<{ errors: any; formData: any }> = ({
  errors,
  formData
}) => (
  <div className="mt-4 rounded-md border bg-gray-50 p-4">
    <h3 className="text-sm font-medium text-gray-700">Form Data</h3>
    <pre className="text-xs text-gray-600">
      {JSON.stringify(formData, null, 2)}
    </pre>
    <h3 className="mt-2 text-sm font-medium text-gray-700">Errors</h3>
    <pre className="text-xs text-gray-600">
      {JSON.stringify(errors, null, 2)}
    </pre>
  </div>
);

const RequestForm: FC = () => {
  const [formData, setFormData] = useState<FormFields>(emptyForm);
  const [errors, setErrors] = useState<FormFields>(emptyForm);

  const regexValidation = {
    number: RegExp(/^\d+(\.\d{0,2})?$/),
    URL: RegExp(/[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~-]*)/gi)
  };

  const checkLensID = (lensID: string): boolean => {
    return lensID !== 'error';
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

  const handleSubmit = () => {
    return;
  };

  const handleReject = () => {
    setFormData(emptyForm);
  };

  return (
    <div className="mx-auto mt-3">
      <div className="space-y-4">
        {/* VERIFY VALID LENS ID */}
        <InputField
          errorMessage={errors.organizationName}
          isLensID
          isRequired
          label="Organization Name"
          name="organizationName"
          onChange={handleChange}
          placeholder="@handle"
          type="text"
          value={formData.organizationName}
        />
        {/* VERIFY VALID LENS ID */}
        <InputField
          errorMessage={errors.donorProfileID}
          isLensID
          isRequired
          label="Donor's Profile ID (only if made by organization)"
          name="donorProfileID"
          onChange={handleChange}
          placeholder="@handle"
          type="text"
          value={formData.donorProfileID}
        />
        {/* LIMIT OF $1-$1000? */}
        <InputField
          errorMessage={errors.donationAmount}
          isNumber
          label="Donation Amount"
          name="donationAmount"
          onChange={handleChange}
          placeholder="$1 - $1,000"
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
          type="text"
          value={formData.volunteerHours}
        />
        {/* REQUIRED IF VOLUNTEER HOURS IS FILLED */}
        <InputField
          errorMessage={errors.evidenceURL}
          isRequired={true}
          isURL
          label="Evidence of Volunteer Activities URL"
          name="evidenceURL"
          onChange={handleChange}
          placeholder="https://example.com"
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
          type="textarea"
          value={formData.description}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <Button
          className="ml-auto"
          onClick={handleReject}
          outline
          variant="danger"
        >
          Reject
        </Button>
        <Button onClick={handleSubmit}>Approve</Button>
      </div>
      <p className="mt-2 text-right text-sm text-red-500">placeholder errors</p>
      <DebugFormState errors={errors} formData={formData} />
    </div>
  );
};

export default RequestForm;
