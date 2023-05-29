import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  Activity,
  HelpCircle,
  Loader,
  Maximize,
  Moon,
  RefreshCcw,
  Sun,
  UploadCloud,
} from 'preact-feather';
import { shallow } from 'zustand/shallow';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

import { drawerWidth } from '@/config';
import { APPNAME, SUPPORTED_CHAINS } from '@/constants';

import AboutModal from '@/components/AboutModal';
import ChainsMenu from '@/components/ChainsMenu';
import SecretsModal from '@/components/SecretsModal';
import WalletsMenu from '@/components/WalletsMenu';
import WalletModal from '@/components/WalletModal';
import MainView from '@/layout/MainView';
import SideBar from '@/layout/SideBar';

import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';

const Home: FunctionComponent = () => {
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showSecretsModal, setShowSecretsModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  const [isLoading, activeWallet, setActiveWallet, walletInputs, setWalletInputs] = useBoundStore(
    (state) => [
      state.isLoading,
      state.activeWallet,
      state.setActiveWallet,
      state.walletInputs,
      state.setWalletInputs,
    ],
    shallow,
  );
  const { wallets, walletDispatch, darkMode, setDarkMode } = usePersistentAppStore();
  const { reset } = useCoingeckoStore();
  const getCurrentBalance = useAlchemyStore((state) => state.getCurrentBalance);

  useEffect(
    () =>
      SUPPORTED_CHAINS.forEach((chain) =>
        wallets.forEach((wallet) => getCurrentBalance({ chain, address: wallet.walletAddress })),
      ),
    [],
  );

  useEffect(() => {
    if (!showWalletModal) {
      setWalletInputs(undefined);
    }
  }, [showWalletModal]);

  const toggleWalletModal = () => {
    setShowWalletModal((show) => !show);
  };
  const toggleSecretsModal = () => {
    setShowSecretsModal((show) => !show);
  };
  const toggleAboutModal = () => {
    setShowAboutModal((show) => !show);
  };
  const handleAdd = (walletName?: string, walletAddress?: string) => {
    setWalletInputs(
      walletName || walletAddress
        ? {
            id: undefined,
            walletName: walletName ?? '',
            walletAddress: walletAddress ?? '',
          }
        : undefined,
    );
    toggleWalletModal();
  };
  const handleEdit = (id: number) => {
    setWalletInputs(wallets.find((wallet) => wallet.id === id));
    toggleWalletModal();
  };
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h5" noWrap sx={{ flexGrow: 1 }}>
            {APPNAME}
          </Typography>

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
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <SideBar
            wallets={wallets}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            dispatch={walletDispatch}
          />
        </Box>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <MainView />
      </Box>

      <AboutModal showModal={showAboutModal} toggleModal={toggleAboutModal} />

      <WalletModal
        showModal={showWalletModal}
        dataToEdit={walletInputs}
        toggleModal={toggleWalletModal}
        dispatch={walletDispatch}
      />

      <SecretsModal showModal={showSecretsModal} toggleModal={toggleSecretsModal} />
    </Box>
  );
};

export default Home;
