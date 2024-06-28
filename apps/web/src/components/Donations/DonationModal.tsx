import React from 'react';

const DonationModal = ({ onClose, post, show }: any) => {
  if (!show || !post) {
    return null;
  }

  // Calculate the total amount donated
  const totalAmountDonated = post.donations.reduce(
    (total: any, donation: any) => total + donation.amount,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Gitcoin</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2 overflow-y-auto" style={{ maxHeight: '300px' }}>
            {post.donations &&
              post.donations.map((donation: any, index: any) => (
                <div className="mb-4 flex items-center" key={index}>
                  <img
                    alt={donation.user.name}
                    className="mr-4 h-10 w-10 rounded-full"
                    src={donation.user.avatar}
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {donation.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Just Donated {donation.amount} {donation.currency}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex w-1/2 flex-col justify-between">
            <div>
              <p className="text-lg">
                Total Amount Donated:
                <span className="font-semibold">${totalAmountDonated} USD</span>
              </p>
              <p className="text-lg">
                Goal: <span className="font-semibold">$5,000 USD</span>
              </p>
            </div>
            <button className="mt-4 rounded-full bg-indigo-500 px-4 py-2 text-white">
              Donation Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
