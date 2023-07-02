import { FunctionComponent } from 'preact';
import { Box, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';

import WalletAction from './WalletAction';

import { useBoundStore } from '@/stores/useBoundStore';

const Introduction: FunctionComponent = () => {
  const [
    setWalletInputs,
    showSecretsModal,
    setShowSecretsModal,
    showWalletModal,
    setShowWalletModal,
  ] = useBoundStore((state) => [
    state.setWalletInputs,
    state.showSecretsModal,
    state.setShowSecretsModal,
    state.showWalletModal,
    state.setShowWalletModal,
  ]);

  const handleAdd = (walletName?: string, walletAddress?: string) => {
    setWalletInputs(
      walletName || walletAddress
        ? { id: undefined, walletName: walletName ?? '', walletAddress: walletAddress ?? '' }
        : undefined,
    );
    setShowWalletModal(!showWalletModal);
  };

  return (
    <Box sx={{ mb: 10 }}>
      <Typography variant="h4">Getting Started</Typography>

      <List>
        <ListItem>
          <Typography variant="h6">
            ❇︎ [<i>optional</i>] Open the
            <Tooltip title={'Secrets Manager'}>
              <span onClick={() => setShowSecretsModal(!showSecretsModal)}>
                {' '}
                Secrets Manager 🌩️{' '}
              </span>
            </Tooltip>
            to provide your own private API keys
          </Typography>
        </ListItem>
        <ListItemText inset>
          <Typography variant="subtitle1">
            – API access provides much better performance + data correctness. Free accounts
            available.
          </Typography>
        </ListItemText>
        <ListItemText inset>
          <Typography variant="subtitle1">
            – View/update at any time via the icon in the top navigation bar.
          </Typography>
        </ListItemText>
        <ListItem>
          <Typography variant="h6">🗸 Enter an ENS name/paste an Ethereum address</Typography>
        </ListItem>
        <ListItem>
          <WalletAction handleAdd={handleAdd} />
        </ListItem>
      </List>
    </Box>
  );
};
export default Introduction;
