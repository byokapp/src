import { sift, unique } from 'radash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { chainAddressEquals, chainAddressUniqueId, contractEquals } from '@/logic';
import { Address, ChainAddress, CurrentBalance, Erc20Balance } from '@/types';

interface Erc20BalanceSnapshot extends Erc20Balance {
  tokenBalanceUsd?: number;
}
interface CurrentBalanceSnapshot extends CurrentBalance {
  nativeBalanceUsd?: number;
  erc20snapshots?: Erc20BalanceSnapshot[];
  totalBalanceUsd?: number;
}
type State = {
  balances: CurrentBalanceSnapshot[];
};
type Actions = {
  balancesReducer: (payload: CurrentBalanceSnapshot) => void;
  tokenBalanceReducer: (payload: {
    chainAddress: ChainAddress;
    contractAddress: Address;
    tokenBalanceUsd: number;
  }) => void;
  totalBalanceReducer: () => void;
};
const initialState: State = {
  balances: [],
};
export const usePersistentBalancesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      balancesReducer: (payload) => {
        // reducer pattern, add or update
        const prevState = get().balances;
        const maybePrevBalance = prevState.find((prev) =>
          chainAddressEquals(prev.chainAddress, payload.chainAddress),
        );

        // spread syntax (...) second overwrites first
        const updatedBalance = { ...maybePrevBalance, ...payload };
        // radash unique(...) preserves first, drops second
        const balances = unique([updatedBalance, ...prevState], (currentBalance) =>
          chainAddressUniqueId(currentBalance.chainAddress),
        );
        set({ balances });
      },
      tokenBalanceReducer: (payload) => {
        // reducer pattern, add or update value
        const prevState = get().balances;
        const prevBalance = prevState.find((prev) =>
          chainAddressEquals(prev.chainAddress, payload.chainAddress),
        );
        if (!prevBalance) return;
        const prevErc20Balance = prevBalance.erc20?.find((erc20Balance) =>
          contractEquals(erc20Balance.contractAddress, payload.contractAddress),
        );
        if (!prevErc20Balance) return;
        const erc20snapshot: Erc20BalanceSnapshot = {
          contractAddress: prevErc20Balance.contractAddress,
          tokenBalance: prevErc20Balance.tokenBalance,
          tokenBalanceUsd: payload.tokenBalanceUsd,
        };
        const erc20snapshots = unique(
          sift([erc20snapshot, ...(prevBalance.erc20snapshots ?? [])]),
          (s) => s.contractAddress,
        );
        const totalBalanceUsd =
          (prevBalance.nativeBalanceUsd ?? 0) +
          erc20snapshots.reduce((acc, snapshot) => {
            return acc + (snapshot.tokenBalanceUsd ?? 0);
          }, 0);
        const newBalance: CurrentBalanceSnapshot = {
          ...prevBalance,
          erc20snapshots,
          totalBalanceUsd,
        };
        const balances = unique([newBalance, ...prevState], (b) =>
          chainAddressUniqueId(b.chainAddress),
        );
        set({ balances });
      },
      totalBalanceReducer: () => {
        const prevState = get().balances;
        const balances = prevState.map((cbs) => {
          const totalBalanceUsd =
            (cbs.nativeBalanceUsd ?? 0) +
            (cbs.erc20snapshots ?? []).reduce(
              (acc, snapshot) => (snapshot.tokenBalanceUsd ?? 0) + acc,
              0,
            );
          return { ...cbs, totalBalanceUsd };
        });
        set({ balances });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.Balances` },
  ),
);
