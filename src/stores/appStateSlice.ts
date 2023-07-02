import { CG_STATIC } from '@/constants';
import { Asset, Chain, TimeWindow, Wallet } from '@/types';
import { StateCreator } from 'zustand';

export interface AppStateSlice {
  activeChain: Chain;
  activeAsset: Asset;
  ensName: string;
  ensAddress: string | null;
  showAboutModal: boolean;
  showSecretsModal: boolean;
  showWalletModal: boolean;
  timeWindow: TimeWindow;
  walletInputs: Wallet | undefined;
  setActiveChain: (chain: Chain) => void;
  setActiveAsset: (activeAsset: Asset) => void;
  setEnsName: (ensName: string) => void;
  setEnsAddress: (ensAddress: string | null) => void;
  setShowAboutModal: (showAboutModal: boolean) => void;
  setShowSecretsModal: (showSecretsModal: boolean) => void;
  setShowWalletModal: (showWalletModal: boolean) => void;
  setTimeWindow: (timeWindow: TimeWindow | undefined) => void;
  setWalletInputs: (wallet: Wallet | undefined) => void;
}
export const createAppStateSlice: StateCreator<AppStateSlice> = (set) => ({
  activeChain: Chain.ETH,
  activeAsset: { id: CG_STATIC[Chain.ETH].nativeAssetId, details: CG_STATIC[Chain.ETH] },
  ensName: '',
  ensAddress: null,
  showAboutModal: false,
  showSecretsModal: false,
  showWalletModal: false,
  timeWindow: TimeWindow.THREE_MONTHS,
  walletInputs: undefined,
  setActiveChain: (activeChain) =>
    set(() => ({
      activeChain,
      activeAsset: { id: CG_STATIC[activeChain].nativeAssetId, details: CG_STATIC[activeChain] },
    })),
  setActiveAsset: (activeAsset) => set(() => ({ activeAsset })),
  setEnsName: (ensName) => set(() => ({ ensName })),
  setEnsAddress: (ensAddress) => set(() => ({ ensAddress })),
  setShowAboutModal: (showAboutModal) => set(() => ({ showAboutModal })),
  setShowSecretsModal: (showSecretsModal) => set(() => ({ showSecretsModal })),
  setShowWalletModal: (showWalletModal) => set(() => ({ showWalletModal })),
  setTimeWindow: (timeWindow) => set(() => ({ timeWindow })),
  setWalletInputs: (walletInputs) => set(() => ({ walletInputs })),
});
