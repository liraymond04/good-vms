import { Card } from '@good/ui';
import {
  DocumentMinusIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import React from 'react';

const Requests = () => {
  return (
    <Card className="space-y-3 p-5">
      <div> Incoming Requests: </div>

      <div style={{ display: 'flex', gap: '6rem' }}>
        <span>
          <label htmlFor="sortBy">Sort By: </label>
          <select className="rounded-xl bg-black" id="sortBy" name="Date">
            <option selected>Name</option>
            <option>Amount</option>
          </select>
        </span>
        <span>
          <label htmlFor="filterBy">Filter By: </label>
          <select className="rounded-xl bg-black" id="filterBy" name="Amount">
            <option selected>Hours</option>
            <option>Amount</option>
          </select>
        </span>
      </div>

      <div className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
        <span>GOOD Request</span>
        <button>
          <DocumentMinusIcon className="size-5" />
        </button>
        <button>
          <DocumentPlusIcon className="size-5" />
        </button>
      </div>
      {/*
      <button
          className="flex w-full items-center space-x-2 rounded-xl border bg-gray-100 px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
          onClick={() => openModal()}
          type="button"
        >
          <PencilSquareIcon className="size-5" />
          <span>What's new?!</span>
        </button>
        */}
    </Card>
  );
};

export default Requests;
