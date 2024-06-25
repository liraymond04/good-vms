import type { FC } from 'react';

interface InputFieldProps {
  errorMessage?: string;
  isLensID?: boolean;
  isNumber?: boolean;
  isRequired?: boolean;
  isURL?: boolean;
  label: string;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  type: 'text' | 'textarea';
  value: string;
}

export interface FormFields {
  description: string;
  donationAmount: string;
  donorProfileID: string;
  evidenceURL: string;
  organizationName: string;
  projectURL: string;
  transactionURL: string;
  volunteerHours: string;
}

export const InputField: FC<InputFieldProps> = ({
  errorMessage,
  isRequired = false,
  label,
  name,
  onChange,
  placeholder,
  type,
  value
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      {type === 'text' ? (
        <input
          className={`block w-full rounded-md border ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          name={name}
          onChange={(e) => {
            onChange(e);
          }}
          placeholder={placeholder}
          type={type}
          value={value}
        />
      ) : (
        <textarea
          className={`block w-full rounded-md border ${
            errorMessage ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          name={name}
          onChange={(e) => {
            onChange(e);
          }}
          placeholder={placeholder}
          value={value}
        />
      )}
      {/* Display error message based on input field type */}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};
