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
import { WalletsAction } from '@/reducers/walletsReducer';
import { useBoundStore } from '@/stores/useBoundStore';
import { Wallet } from '@/types';

interface SideBarProps {
  wallets: Wallet[];
  handleAdd: (walletName?: string, walletAddress?: string) => void;
  handleEdit: (id: number) => void;
  dispatch: (action: WalletsAction) => void;
}
const SideBar: FunctionComponent<SideBarProps> = ({ wallets, handleAdd, handleEdit, dispatch }) => {
  const [activeWallet, setActiveWallet] = useBoundStore((state) => [
    state.activeWallet,
    state.setActiveWallet,
  ]);

  return (
    <>
      <List dense={false}>
        <ListItem>
          <ListItemText primary={'Wallets'} secondary={'EOA/Smart Contract addresses'} />
        </ListItem>
      </List>
      <WalletList wallets={wallets} handleEdit={handleEdit} dispatch={dispatch} />
      <WalletAction handleAdd={handleAdd} />
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
                      setActiveWallet(undefined);
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
        {/* <ListItem key={'About'}>
          <ListItemButton>
            <Link href="/about">
              <ListItemText primary={'About'} />
            </Link>
          </ListItemButton>
        </ListItem> */}
      </List>
    </>
  );
};

export default SideBar;
