import type { PublicationMarketplaceMetadataAttribute } from '@good/lens';
// import type { MetadataAttribute } from '@lens-protocol/metadata';

import { createTrackedSelector } from 'react-tracked';
import { create } from 'zustand';

interface State {
  addAttribute: (attribute: PublicationMarketplaceMetadataAttribute) => void;
  attributes: PublicationMarketplaceMetadataAttribute[] | undefined;
  getAttribute: (
    traitType: string
  ) => PublicationMarketplaceMetadataAttribute | undefined;
  removeAttribute: (traitType: string) => void;
  reset: () => void;
  updateAttribute: (traitType: string, value: string) => void;
}

const store = create<State>((set, get) => ({
  addAttribute: (attribute) =>
    set((state) => ({
      attributes: state.attributes
        ? [...state.attributes, attribute]
        : [attribute]
    })),
  attributes: undefined,
  getAttribute: (traitType) =>
    get().attributes?.find((attribute) => attribute.traitType === traitType),
  removeAttribute: (traitType) =>
    set((state) => ({
      attributes: state.attributes?.filter(
        (attribute) => attribute.traitType !== traitType
      )
    })),
  reset: () => set({ attributes: undefined }),
  updateAttribute: (traitType, value: any) =>
    set((state) => ({
      attributes: state.attributes?.map((attribute) =>
        attribute.traitType === traitType ? { ...attribute, value } : attribute
      )
    }))
}));

export const useRequestFormDataStore = createTrackedSelector(store);
