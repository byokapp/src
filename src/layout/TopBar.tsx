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
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { shallow } from 'zustand/shallow';

import { APPNAME } from '@/constants';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';

import WalletsMenu from '@/components/WalletsMenu';
import ChainsMenu from '@/components/ChainsMenu';

interface TopBarProps {
  sparse: boolean;
  drawerOpen: boolean;
  handleDrawerOpen: ()=> void;
}
const TopBar: FunctionComponent<TopBarProps> = ({ sparse, drawerOpen, handleDrawerOpen }) => {
  const [
    isLoading,
    activeWallet,
    setActiveWallet,
    showAboutModal,
    setShowAboutModal,
    showSecretsModal,
    setShowSecretsModal,
  ] = useBoundStore(
    (state) => [
      state.isLoading,
      state.activeWallet,
      state.setActiveWallet,
      state.showAboutModal,
      state.setShowAboutModal,
      state.showSecretsModal,
      state.setShowSecretsModal,
    ],
    shallow,
  );
  const { darkMode, setDarkMode } = usePersistentAppStore();
  const { reset } = useCoingeckoStore();

  const toggleSecretsModal = () => {
    setShowSecretsModal(!showSecretsModal);
  };
  const toggleAboutModal = () => {
    setShowAboutModal(!showAboutModal);
  };
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton 
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(drawerOpen && { display: 'none' }),
          }}
        >
          <Menu size={25}/>
        </IconButton> 

        <Typography variant="h5" noWrap sx={{ flexGrow: 1 }}>
          {APPNAME}
        </Typography>

        {!sparse && (
          <Stack direction="row" spacing={1.5}>
            {activeWallet ? (
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
              >
                <WalletsMenu />
                <ChainsMenu />
                <Tooltip title={'Clear Selection'}>
                  <Box onClick={() => setActiveWallet(undefined)}>
                    <Maximize />
                  </Box>
                </Tooltip>
                <Box> </Box>
              </Stack>
            ) : null}
            <Tooltip title={'Refresh Token Metadata'}>
              <Box onClick={reset}>
                <RefreshCcw />
              </Box>
            </Tooltip>
            <Tooltip title={'Secrets Manager'}>
              <Box onClick={toggleSecretsModal}>
                <UploadCloud />
              </Box>
            </Tooltip>
            <Tooltip title={'About'}>
              <Box onClick={toggleAboutModal}>
                <HelpCircle />
              </Box>
            </Tooltip>
            {false && (
              <Tooltip title={`switch to ${darkMode ? 'Light' : 'Dark'} mode`}>
                <Box onClick={toggleDarkMode}>{darkMode ? <Moon /> : <Sun />}</Box>
              </Tooltip>
            )}
            <Tooltip title={isLoading ? 'loading...' : 'Ready'}>
              <Box>{isLoading ? <Loader /> : <Activity />}</Box>
            </Tooltip>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
