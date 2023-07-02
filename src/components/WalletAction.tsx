import { FunctionComponent } from 'preact';
import { PlusSquare } from 'preact-feather';
import { IconButton, List, ListItem } from '@mui/material';

import EnsForm from '@/components/EnsForm';

import { drawerWidth } from '@/config';
import { useBoundStore } from '@/stores/useBoundStore';

interface WalletActionProps {
  handleAdd: (walletName?: string, walletAddress?: string) => void;
}
const WalletAction: FunctionComponent<WalletActionProps> = ({ handleAdd }) => {
  const { ensName, ensAddress } = useBoundStore((state) => ({
    ensName: state.ensName,
    ensAddress: state.ensAddress,
  }));

  const plusButton = ensAddress ? <PlusSquare color="#1565C0" /> : undefined;

  return (
    <List dense={true} sx={{ width: drawerWidth - 20 }}>
      <ListItem
        key={'<Add Wallet>'}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => handleAdd(ensName, ensAddress ?? undefined)}
          >
            {plusButton}
          </IconButton>
        }
      >
        <EnsForm />
      </ListItem>
    </List>
  );
};
export default WalletAction;
