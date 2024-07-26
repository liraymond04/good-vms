import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  requestParams: {
    createdAt: Date;
    description: string;
    donationAmount: number;
    donorProfileID: string;
    evidenceURL: string;
    id: string;
    organizationName: string;
    projectURL: string;
    transactionURL: string;
    volunteerHours: number;
  };
  resetRequestParams: () => void;
  setRequestParams: (requestParams: State['requestParams']) => void;
  setShowRequestEditor: (showRequestEditor: boolean) => void;
  showRequestEditor: boolean;
}

const store = create<State>((set) => ({
  requestParams: {
    createdAt: new Date(),
    description: '',
    donationAmount: 0,
    donorProfileID: '',
    evidenceURL: '',
    id: '',
    organizationName: '',
    projectURL: '',
    transactionURL: '',
    volunteerHours: 0
  },
  resetRequestParams: () =>
    set(() => ({
      requestParams: {
        createdAt: new Date(),
        description: '',
        donationAmount: 0,
        donorProfileID: '',
        evidenceURL: '',
        id: '',
        organizationName: '',
        projectURL: '',
        transactionURL: '',
        volunteerHours: 0
      }
    })),
  setRequestParams: (requestParams) => set(() => ({ requestParams })),
  setShowRequestEditor: (showRequestEditor) =>
    set(() => ({ showRequestEditor })),
  showRequestEditor: false
}));

export const usePublicationRequestStore = createTrackedSelector(store);
