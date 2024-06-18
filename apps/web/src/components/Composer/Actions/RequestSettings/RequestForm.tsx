import type { FC } from 'react';

import { Button } from '@good/ui';

const InputField: FC<{
  label: string;
  placeholder: string;
  type: string;
}> = ({ label, placeholder, type }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      placeholder={placeholder}
      type={type}
    />
  </div>
);

const RequestForm: FC = () => {
  return (
    <div className="mx-auto mt-3">
      <div className="space-y-4">
        <InputField
          label="Organization Name"
          placeholder="OrganizationName"
          type="text"
        />
        <InputField
          label="Donor's Profile ID (only if made by organization)"
          placeholder="x1yz23"
          type="text"
        />
        <InputField label="Donation Amount" placeholder="$500" type="text" />
        <InputField
          label="Cause URL"
          placeholder="https://example.com"
          type="text"
        />
        <InputField
          label="Donation Transaction URL"
          placeholder="transactionurl.com"
          type="text"
        />
        <InputField label="Volunteer Hours" placeholder="5 hours" type="text" />
        <InputField
          label="Link to Volunteer Activities (evidence)"
          placeholder="imgur.com/123456abc"
          type="text"
        />
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <Button className="ml-auto" outline variant="danger">
          Reject
        </Button>
        <Button>Approve</Button>
      </div>
    </div>
  );
};

export default RequestForm;
