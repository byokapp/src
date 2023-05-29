import { FunctionComponent } from 'preact';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { WalletsAction } from '@/reducers/walletsReducer';
import { useEffect, useState } from 'preact/hooks';
import { Wallet } from '@/types';

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
      dispatch({
        payload: {
          ...walletSkeleton,
          id: Date.now(), // returns current timestamp
        },
        type: 'ADD_WALLET',
      });
      setWalletSkeleton({
        walletAddress: '',
        walletName: '',
      });
    }
    toggleModal();
  };

  return (
    <Dialog open={showModal} onClose={toggleModal}>
      <form spellCheck={false} onSubmit={handleOnClick}>
        <DialogTitle>{dataToEdit?.id ? 'Edit' : 'Add'}</DialogTitle>
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
          <Button type="submit" variant="contained" sx={{ textTransform: 'capitalize' }}>
            {dataToEdit?.id ? 'Edit' : 'Add'} Wallet
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default WalletModal;
