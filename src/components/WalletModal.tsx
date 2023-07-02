import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { WalletsAction } from '@/reducers/walletsReducer';
import { useBoundStore } from '@/stores/useBoundStore';
import { Wallet } from '@/types';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { X } from 'preact-feather';

interface WalletModalProps {
  showModal: boolean;
  dataToEdit: Wallet | undefined;
  toggleModal: () => void;
  dispatch: (action: WalletsAction) => void;
}
const WalletModal: FunctionComponent<WalletModalProps> = ({
  toggleModal,
  dataToEdit,
  showModal,
  dispatch,
}) => {
  const [walletSkeleton, setWalletSkeleton] = useState({ walletAddress: '', walletName: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const { setActiveWalletId } = usePersistentAppStore();
  const [setEnsName, setEnsAddress] = useBoundStore((state) => [
    state.setEnsName,
    state.setEnsAddress,
  ]);

  const cleanupAppStateAfterAddingWallet = (newWalletId: number) => {
    setActiveWalletId(newWalletId);
    setEnsName('');
    setEnsAddress(null);
  };

  useEffect(() => {
    setErrorMsg('');
    setWalletSkeleton({
      walletAddress: dataToEdit?.walletAddress ?? '',
      walletName: dataToEdit?.walletName ?? '',
    });
  }, [dataToEdit]);

  const handleOnClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { walletAddress, walletName } = walletSkeleton;
    if (walletAddress.trim() === '' || walletName.trim() === '') {
      setErrorMsg('All the fields are required.');
      return;
    }

    if (dataToEdit?.id) {
      dispatch({
        payload: {
          id: dataToEdit.id,
          updates: {
            id: Date.now(),
            ...walletSkeleton,
          },
        },
        type: 'UPDATE_WALLET',
      });
    } else {
      const newWalletId = Date.now(); // returns current timestamp
      dispatch({
        payload: {
          ...walletSkeleton,
          id: newWalletId,
        },
        type: 'ADD_WALLET',
      });
      setWalletSkeleton({
        walletAddress: '',
        walletName: '',
      });
      cleanupAppStateAfterAddingWallet(newWalletId);
    }
    toggleModal();
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog fullScreen={fullScreen} open={showModal} onClose={toggleModal}>
      <form spellCheck={false} onSubmit={handleOnClick}>
        <DialogTitle>
          {fullScreen ? <X onClick={toggleModal} color="grey" /> : undefined}
          {dataToEdit?.id ? 'Edit' : 'Add'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Wallet</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={walletSkeleton.walletName}
            onChange={(e) => setWalletSkeleton({ ...walletSkeleton, walletName: e.target.value })}
            fullWidth
            variant="standard"
            error={errorMsg !== ''}
            helperText={errorMsg !== '' ? errorMsg : undefined}
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            value={walletSkeleton.walletAddress}
            onChange={(e) =>
              setWalletSkeleton({ ...walletSkeleton, walletAddress: e.target.value })
            }
            fullWidth
            variant="standard"
            error={errorMsg !== ''}
            helperText={errorMsg !== '' ? errorMsg : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained">
            {dataToEdit?.id ? 'Make Changes' : 'Add Wallet'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default WalletModal;
