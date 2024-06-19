import { Card } from '@good/ui';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

const Requests = () => {
  return (
    <Card className="space-y-3 p-5">
      <div> Incoming Requests: </div>

      <div style={{ display: 'flex', gap: '6rem' }}>
        <span>
          <label htmlFor="sortBy">Sort By: </label>
          <select className="rounded-xl" id="sortBy" name="Date">
            <option selected>Name</option>
            <option>Amount</option>
          </select>
        </span>
        <span>
          <label htmlFor="filterBy">Filter By: </label>
          <select className="rounded-xl" id="filterBy" name="Amount">
            <option selected>Hours</option>
            <option>Amount</option>
          </select>
        </span>
      </div>

      <div
        className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
        id="goodRequest"
      >
        <span className="px-2">Volunteer Name</span>
        <span className="px-2">Amount</span>
        <span className="px-2">Hours</span>
        <span className="px-2">YYYY-MM-DD</span>
        <span className="py-2 pl-5">
          <button className="pl-4" style={{ verticalAlign: 'middle' }}>
            <MinusIcon className="size-5" />
          </button>
          <button className="pl-5" style={{ verticalAlign: 'middle' }}>
            <PlusIcon className="size-5" />
          </button>
        </span>
      </div>
    </Card>
  );
};

export default Requests;
