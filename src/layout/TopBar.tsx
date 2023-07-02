import { FunctionComponent } from 'preact';
import {
  Activity,
  HelpCircle,
  Loader,
  Maximize,
  Menu,
  Moon,
  RefreshCcw,
  Sun,
  UploadCloud,
} from 'preact-feather';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { shallow } from 'zustand/shallow';

import { APPNAME } from '@/constants';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';

import WalletsMenu from '@/components/WalletsMenu';
import ChainsMenu from '@/components/ChainsMenu';

interface TopBarProps {
  sparse: boolean;
  handleDrawerToggle: () => void;
}
const TopBar: FunctionComponent<TopBarProps> = ({ sparse, handleDrawerToggle }) => {
  const [isLoading, showAboutModal, setShowAboutModal, showSecretsModal, setShowSecretsModal] =
    useBoundStore(
      (state) => [
        state.isLoading,
        state.showAboutModal,
        state.setShowAboutModal,
        state.showSecretsModal,
        state.setShowSecretsModal,
      ],
      shallow,
    );
  const { wallets, activeWalletId, setActiveWalletId, darkMode, setDarkMode } =
    usePersistentAppStore();
  const { reset } = useCoingeckoStore();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ marginRight: 5 }}
        >
          <Menu size={25} />
        </IconButton>

        <Typography variant="h5" noWrap sx={{ flexGrow: 1 }}>
          {APPNAME}
        </Typography>

        {!sparse && (
          <Stack direction="row" spacing={1.5}>
            {wallets.length > 0 ? (
              <>
                <Stack direction="row" spacing={2}>
                  {activeWalletId ? (
                    <>
                      <WalletsMenu />
                      <ChainsMenu />
                    </>
                  ) : (
                    <>
                      <ChainsMenu />
                      <WalletsMenu />
                    </>
                  )}
                </Stack>
                <Divider orientation="vertical" flexItem />
              </>
            ) : undefined}
            {activeWalletId ? (
              <Tooltip title={'Clear Selection'}>
                <Box onClick={() => setActiveWalletId(undefined)}>
                  <Maximize />
                </Box>
              </Tooltip>
            ) : undefined}
            <Tooltip title={'Refresh Token Metadata'}>
              <Box onClick={reset}>
                <RefreshCcw />
              </Box>
            </Tooltip>
            <Tooltip title={'Secrets Manager'}>
              <Box onClick={() => setShowSecretsModal(!showSecretsModal)}>
                <UploadCloud />
              </Box>
            </Tooltip>
            {false && (
              <Tooltip title={`switch to ${darkMode ? 'Light' : 'Dark'} mode`}>
                <Box onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Moon /> : <Sun />}</Box>
              </Tooltip>
            )}
            <Tooltip title={'About'}>
              <Box onClick={() => setShowAboutModal(!showAboutModal)}>
                <HelpCircle />
              </Box>
            </Tooltip>
            {false && (
              <Tooltip title={isLoading ? 'loading...' : 'Ready'}>
                <Box>{isLoading ? <Loader /> : <Activity />}</Box>
              </Tooltip>
            )}
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
