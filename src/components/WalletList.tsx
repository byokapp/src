import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Edit3, Trash2 } from 'preact-feather';
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

import { contractEquals, dollarify } from '@/logic';
import { Wallet } from '@/types';
import { WalletsAction } from '@/reducers/walletsReducer';
import { usePersistentBalancesStore } from '@/stores/persistentBalancesState';
import { usePersistentAppStore } from '@/stores/persistentAppState';

interface WalletListProps {
  wallets: Wallet[];
  handleEdit: (id: number) => void;
  dispatch: (action: WalletsAction) => void;
}
const WalletList: FunctionComponent<WalletListProps> = ({ wallets, handleEdit, dispatch }) => {
  const { setActiveWalletId } = usePersistentAppStore();
  const [balances, totalBalanceReducer] = usePersistentBalancesStore((state) => [
    state.balances,
    state.totalBalanceReducer,
  ]);

  useEffect(() => totalBalanceReducer(), []);

  const sumNativeBalanceUsd = (wallet: Wallet) =>
    balances.reduce(
      (acc, balance) =>
        (contractEquals(wallet.walletAddress, balance.chainAddress.address)
          ? balance.totalBalanceUsd ?? balance.nativeBalanceUsd ?? 0
          : 0) + acc,
      0,
    );

  return (
    <List dense={true}>
      {wallets.map((wallet) => {
        const { id, walletName } = wallet;
        if (!id) return null;
        return (
          <ListItem
            key={id}
            disablePadding
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(id)}>
                  <Edit3 />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <Trash2
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        `Are you sure you want to delete wallet ${walletName}?`,
                      );
                      if (confirmDelete) {
                        dispatch({
                          payload: { id },
                          type: 'DELETE_WALLET',
                        });
                      }
                    }}
                  />
                </IconButton>{' '}
              </>
            }
          >
            <ListItemButton onClick={() => setActiveWalletId(wallet.id)}>
              <ListItemText
                primary={walletName}
                secondary={dollarify(sumNativeBalanceUsd(wallet))}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
export default WalletList;
