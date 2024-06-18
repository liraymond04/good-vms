// Created based on usePublicationPollStore.ts, adjust as required
import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  requestConfig: {
    length: number;
    options: string[];
  };
  resetRequestConfig: () => void;
  setRequestConfig: (pollConfig: { length: number; options: string[] }) => void;
  setShowRequestEditor: (showPollEditor: boolean) => void;
  showRequestEditor: boolean;
}

const store = create<State>((set) => ({
  requestConfig: { length: 7, options: ['', ''] },
  resetRequestConfig: () =>
    set(() => ({ requestConfig: { length: 1, options: ['', ''] } })),
  setRequestConfig: (requestConfig) => set(() => ({ requestConfig })),
  setShowRequestEditor: (showRequestEditor) => set(() => ({ showRequestEditor })),
  showRequestEditor: false
}));

export const usePublicationRequestStore = createTrackedSelector(store);
