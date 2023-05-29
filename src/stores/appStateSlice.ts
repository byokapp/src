import { CG_STATIC } from '@/constants';
import { Asset, Chain, TimeWindow, Wallet } from '@/types';
import { StateCreator } from 'zustand';

export interface AppStateSlice {
  activeChain: Chain;
  activeWallet: Wallet | undefined;
  activeAsset: Asset;
  ensName: string;
  ensAddress: string | null;
  timeWindow: TimeWindow;
  walletInputs: Wallet | undefined;
  setActiveChain: (chain: Chain) => void;
  setActiveWallet: (wallet: Wallet | undefined) => void;
  setActiveAsset: (activeAsset: Asset) => void;
  setEnsName: (ensName: string) => void;
  setEnsAddress: (ensAddress: string | null) => void;
  setTimeWindow: (timeWindow: TimeWindow | undefined) => void;
  setWalletInputs: (wallet: Wallet | undefined) => void;
}
export const createAppStateSlice: StateCreator<AppStateSlice> = (set) => ({
  activeChain: Chain.ETH,
  activeWallet: undefined,
  activeAsset: { id: CG_STATIC[Chain.ETH].nativeAssetId, details: CG_STATIC[Chain.ETH] },
  ensName: '',
  ensAddress: null,
  timeWindow: TimeWindow.THREE_MONTHS,
  walletInputs: undefined,
  setActiveChain: (activeChain) =>
    set(() => ({
      activeChain,
      activeAsset: { id: CG_STATIC[activeChain].nativeAssetId, details: CG_STATIC[activeChain] },
    })),
  setActiveWallet: (activeWallet) => set(() => ({ activeWallet })),
  setActiveAsset: (activeAsset) => set(() => ({ activeAsset })),
  setEnsName: (ensName) => set(() => ({ ensName })),
  setEnsAddress: (ensAddress) => set(() => ({ ensAddress })),
  setTimeWindow: (timeWindow) => set(() => ({ timeWindow })),
  setWalletInputs: (walletInputs) => set(() => ({ walletInputs })),
});
