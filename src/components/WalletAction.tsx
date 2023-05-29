import { FunctionComponent } from 'preact';
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { PlusSquare } from 'preact-feather';
import { useBoundStore } from '@/stores/useBoundStore';
import EnsForm from '@/components/EnsForm';

interface WalletActionProps {
  handleAdd: (walletName?: string, walletAddress?: string) => void;
}
const WalletAction: FunctionComponent<WalletActionProps> = ({ handleAdd }) => {
  const { ensName, ensAddress } = useBoundStore((state) => ({
    ensName: state.ensName,
    ensAddress: state.ensAddress,
  }));

  return (
    <List dense={true}>
      <ListItem
        key={'<Add Wallet>'}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="edit"
            onClick={() => handleAdd(ensName, ensAddress ?? undefined)}
          >
            <PlusSquare />
          </IconButton>
        }
      >
        <EnsForm />
      </ListItem>
    </List>
  );
};
export default WalletAction;
