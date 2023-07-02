import { FunctionComponent } from 'preact';
import { Maximize } from 'preact-feather';
import { Link } from 'wouter-preact';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material';

import ChainList from '@/components/ChainList';
import WalletAction from '@/components/WalletAction';
import WalletList from '@/components/WalletList';

import { SUPPORTED_CHAINS } from '@/constants';
import { useBoundStore } from '@/stores/useBoundStore';
import { usePersistentAppStore } from '@/stores/persistentAppState';

interface SideBarProps {}
const SideBar: FunctionComponent<SideBarProps> = () => {
  const [setWalletInputs, showWalletModal, setShowWalletModal] = useBoundStore((state) => [
    state.setWalletInputs,
    state.showWalletModal,
    state.setShowWalletModal,
  ]);
  const {
    wallets,
    activeWalletId,
    setActiveWalletId,
    walletDispatch: dispatch,
  } = usePersistentAppStore();
  const activeWallet = wallets.find((w) => w.id === activeWalletId);

  const toggleWalletModal = () => setShowWalletModal(!showWalletModal);
  const handleAdd = (walletName?: string, walletAddress?: string) => {
    setWalletInputs(
      walletName || walletAddress
        ? { id: undefined, walletName: walletName ?? '', walletAddress: walletAddress ?? '' }
        : undefined,
    );
    toggleWalletModal();
  };
  const handleEdit = (id: number) => {
    setWalletInputs(wallets.find((wallet) => wallet.id === id));
    toggleWalletModal();
  };

  return (
    <>
      <List dense={false}>
        <ListItem>
          <ListItemText primary={'Wallets'} secondary={'EOA/Smart Contract addresses'} />
        </ListItem>
      </List>
      <WalletList wallets={wallets} handleEdit={handleEdit} dispatch={dispatch} />
      {wallets.length === 0 ? undefined : <WalletAction handleAdd={handleAdd} />}
      <Divider />
      <List dense={false}>
        <ListItem
          secondaryAction={
            activeWallet ? (
              <>
                <Tooltip title={'Clear Selection'}>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setActiveWalletId(undefined);
                    }}
                  >
                    <Maximize />
                  </IconButton>
                </Tooltip>
              </>
            ) : null
          }
        >
          <ListItemText
            primary={[activeWallet?.walletName, 'Chains'].join(' ')}
            secondary={'EVM L1/L2'}
          />
        </ListItem>
      </List>
      <ChainList orderedChainList={SUPPORTED_CHAINS} />
      <Divider />
      <List dense={false}>
        <ListItem key={'Uses'} disablePadding>
          <ListItemButton>
            <Link href="/uses">
              <ListItemText primary={'/uses'} />
            </Link>
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
};

export default SideBar;
