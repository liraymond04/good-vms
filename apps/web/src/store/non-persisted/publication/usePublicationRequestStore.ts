import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  requestParams: {
    id: string;
    organizationName: string;
    donorProfileID: string;
    donationAmount: number;
    transactionURL: string;
    projectURL: string;
    volunteerHours: number;
    evidenceURL: string;
    description: string;
    createdAt: Date;
  };
  resetRequestParams: () => void;
  setRequestParams: (requestParams: State['requestParams']) => void;
  setShowRequestEditor: (showRequestEditor: boolean) => void;
  showRequestEditor: boolean;
}

const store = create<State>((set) => ({
  requestParams: { id: '', organizationName: '', donorProfileID: '', donationAmount: 0, transactionURL: '', projectURL: '', volunteerHours: 0, evidenceURL: '', description: '', createdAt: new Date() },
  resetRequestParams: () => set(() => ({ requestParams: { id: '', organizationName: '', donorProfileID: '', donationAmount: 0, transactionURL: '', projectURL: '', volunteerHours: 0, evidenceURL: '', description: '', createdAt: new Date() } })),
  setRequestParams: (requestParams) => set(() => ({ requestParams })),
  setShowRequestEditor: (showRequestEditor) => set(() => ({ showRequestEditor })),
  showRequestEditor: false
}));

export const usePublicationRequestStore = createTrackedSelector(store);
