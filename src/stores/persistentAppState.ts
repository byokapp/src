import { unique } from 'radash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { WalletsAction, walletsReducer } from '@/reducers/walletsReducer';
import { MediaCard, Secrets, Wallet } from '@/types';

export interface ImageMetadata extends MediaCard {
  id: string;
}
interface PersonalizationOption {
  component: string;
  imageId?: string;
}
type State = {
  darkMode: boolean;
  wallets: Wallet[];
  activeWalletId: number | undefined;
  secrets: Secrets;
  personalization: PersonalizationOption[];
  images: ImageMetadata[];
};
type Actions = {
  setDarkMode: (darkMode: boolean) => void;
  walletDispatch: (action: WalletsAction) => void;
  setActiveWalletId: (activeWalletId: number | undefined) => void;
  setSecrets: (secrets: Secrets) => void;
  reducePersonalization: (newPersonalizationOption: PersonalizationOption) => void;
};
const initialState: State = {
  darkMode: false,
  wallets: [],
  activeWalletId: undefined,
  secrets: {},
  personalization: [
    { component: 'Welcome', imageId: 'keys' },
    { component: 'Uses', imageId: 'enlightenment' },
  ],
  images: [],
};
export const usePersistentAppStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setDarkMode: (darkMode) => set({ darkMode }),
      walletDispatch: (action) => {
        set({ wallets: walletsReducer({ wallets: get().wallets }, action).wallets });
      },
      setActiveWalletId: (activeWalletId) => set(() => ({ activeWalletId })),
      setSecrets: (secrets) => set({ secrets }),
      reducePersonalization: (newPersonalization) => {
        const prevState = get().personalization;
        // radash unique(...) preserves first, drops second
        const personalization = unique([newPersonalization, ...prevState], (p) => p.component);
        set({ personalization });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.App` },
  ),
);
