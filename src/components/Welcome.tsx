import { FunctionComponent } from 'preact';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'wouter-preact';

import ExternalLink from './ExternalLink';
import MediaCard from './MediaCard';
import WalletAction from './WalletAction';

import { isSmallScreen } from '@/uiLogic';
import { useBoundStore } from '@/stores/useBoundStore';

const Welcome: FunctionComponent = () => {
  const [setWalletInputs, showWalletModal, setShowWalletModal] = useBoundStore((state) => [
    state.setWalletInputs,
    state.showWalletModal,
    state.setShowWalletModal,
  ]);

  const toggleWalletModal = () => setShowWalletModal(!showWalletModal);
  const handleAdd = (walletName?: string, walletAddress?: string) => {
    setWalletInputs(
      walletName || walletAddress
        ? { id: undefined, walletName: walletName ?? '', walletAddress: walletAddress ?? '' }
        : undefined,
    );
    toggleWalletModal();
  };

  const fullContent = !isSmallScreen();
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
          <Box>
            {fullContent && (
              <>
                <Typography variant="h5" noWrap>
                  Bring Your Own Address and API keys
                </Typography>
                <Typography variant="overline" display="block" sx={{ mb: 5 }}>
                  transparency, decentralization, composability
                </Typography>
              </>
            )}

            <Typography variant="h6">🗸 Enter an ENS name/paste an Ethereum address</Typography>
            <WalletAction handleAdd={handleAdd} />

            <Typography sx={{ mt: 3 }}>
              Private: no database [<Link href="/uses">details 👀</Link>]
            </Typography>

            <Typography sx={{ mt: 3 }}>
              FOSS: MIT license [
              <ExternalLink href="https://github.com/byokapp/free">details 👀</ExternalLink>]
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={4}>
          <MediaCard component={'Welcome'} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default Welcome;
