import { FunctionComponent } from 'preact';
import { unique } from 'radash';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import ChainItem from './ChainItem';

import { CG_STATIC } from '@/constants';
import { chainAddressEquals, dollarify } from '@/logic';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { usePersistentBalancesStore } from '@/stores/persistentBalancesState';
import { useBoundStore } from '@/stores/useBoundStore';
import { Chain } from '@/types';

interface ChainListProps {
  orderedChainList: Chain[];
}
const ChainList: FunctionComponent<ChainListProps> = ({ orderedChainList }) => {
  const { wallets, activeWalletId } = usePersistentAppStore();
  const balances = usePersistentBalancesStore((state) => state.balances);
  const [setActiveChain] = useBoundStore((state) => [state.setActiveChain]);
  const activeWallet = wallets.find((w) => w.id === activeWalletId);

  const walletAddresses = unique(wallets, (w) => w.walletAddress).map((w) => w.walletAddress);
  const balancesForWallets = balances.filter((balance) =>
    walletAddresses.includes(balance.chainAddress.address),
  );

  const sumBalancesUsd = (chain: Chain) => {
    const currentBalanceSnapshots = balancesForWallets.filter((balance) =>
      activeWallet
        ? chainAddressEquals(balance.chainAddress, { chain, address: activeWallet.walletAddress })
        : balance.chainAddress.chain === chain,
    );
    const nativeBalanceUsd = currentBalanceSnapshots.reduce(
      (acc, cbs) => (cbs.nativeBalanceUsd ?? 0) + acc,
      0,
    );
    const erc20BalancesUsd = currentBalanceSnapshots.reduce(
      (erc20Accumulator, cbs) =>
        (cbs.erc20snapshots ?? []).reduce(
          (cbsAccumulator, snapshot) => (snapshot.tokenBalanceUsd ?? 0) + cbsAccumulator,
          0,
        ) + erc20Accumulator,
      0,
    );
    const totalBalanceUsd = nativeBalanceUsd + erc20BalancesUsd;
    return totalBalanceUsd;
  };

  return (
    <List dense={true}>
      {orderedChainList.map((chain) => (
        <ListItem key={chain} disablePadding>
          <ListItemButton onClick={() => setActiveChain(chain)}>
            <ListItemIcon>
              <ChainItem chain={chain} />
            </ListItemIcon>
            <ListItemText
              primary={CG_STATIC[chain].name}
              secondary={dollarify(sumBalancesUsd(chain))}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
export default ChainList;
