import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Eye, EyeOff, UserX } from 'preact-feather';
import {
  Box,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';

import { SECRETS_KEYS } from '@/constants';
import { usePersistentAppStore } from '@/stores/persistentAppState';

interface SecretsModalProps {
  showModal: boolean;
  toggleModal: () => void;
}
const SecretsModal: FunctionComponent<SecretsModalProps> = ({ toggleModal, showModal }) => {
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [secrets, setSecrets] = usePersistentAppStore((state) => [state.secrets, state.setSecrets]);
  const [hideSecrets, setHideSecrets] = useState<boolean>(true);

  const handleClickHideSecrets = () => setHideSecrets((hide) => !hide);

  const handleMouseDownSecrets = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  if (!secrets.etherscan && !secrets.alchemy) {
    setErrorMsg('missing Etherscan and Alchemy');
  } else if (!secrets.etherscan) {
    setErrorMsg('missing Etherscan');
  } else if (!secrets.alchemy) {
    setErrorMsg('missing Alchemy');
  } else {
    setErrorMsg(undefined);
  }

  return (
    <Dialog open={showModal} onClose={toggleModal}>
      <DialogTitle>Secrets Manager</DialogTitle>
      <DialogContent>
        <DialogContentText>API private keys—only ever stored in your own browser</DialogContentText>
        {SECRETS_KEYS.map((key, index) => (
          <TextField
            autoFocus
            margin="dense"
            id={key}
            label={key.toLocaleUpperCase()}
            type={hideSecrets ? 'password' : 'text'}
            value={secrets[key]}
            onChange={(e) => {
              setSecrets({ ...secrets, [key]: e.target.value });
            }}
            fullWidth
            variant="outlined"
            spellCheck={false}
            error={!!errorMsg}
            helperText={index === 1 && errorMsg !== '' ? errorMsg : undefined}
            InputProps={{
              endAdornment:
                index === 0 ? (
                  <IconButton onClick={handleClickHideSecrets} onMouseDown={handleMouseDownSecrets}>
                    <InputAdornment position={'end'}>
                      {hideSecrets ? <Eye /> : <EyeOff />}
                    </InputAdornment>
                  </IconButton>
                ) : null,
            }}
          />
        ))}
        <Divider />
        <DialogContentText display="flex" justifyContent="flex-end">
          1-Click Clear All User Data—this cannot be undone!
        </DialogContentText>
        <Tooltip title={'Clear All User Data'}>
          <Box
            display="flex"
            justifyContent="flex-end"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            <UserX />
          </Box>
        </Tooltip>
      </DialogContent>
    </Dialog>
  );
};
export default SecretsModal;
