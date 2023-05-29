import { Wallet } from '@/types';

export interface WalletsAction {
  type: 'ADD_WALLET' | 'UPDATE_WALLET' | 'DELETE_WALLET';
  payload?: Wallet | UpdatePayload;
}
interface UpdatePayload {
  id: number;
  updates?: Wallet;
}
interface WalletsState {
  wallets: Wallet[];
}
export const walletsReducer = (state: WalletsState, action: WalletsAction): WalletsState => {
  let newState: WalletsState;
  if (action.type === 'ADD_WALLET') {
    newState = {
      ...state,
      wallets: [...state.wallets, action.payload as Wallet],
    };
  } else if (action.type === 'UPDATE_WALLET') {
    const { id, updates } = action.payload as UpdatePayload;
    newState = {
      ...state,
      wallets: state.wallets.map((wallet) => {
        if (wallet.id === id) {
          return {
            ...wallet,
            ...updates,
          };
        }
        return wallet;
      }),
    };
  } else if (action.payload && action.type === 'DELETE_WALLET') {
    const { id } = action.payload;
    newState = {
      ...state,
      wallets: state.wallets.filter((wallet) => wallet.id !== id),
    };
  } else {
    newState = state;
  }
  return newState;
};
