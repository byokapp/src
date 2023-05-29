import { FunctionComponent } from 'preact';
import Balances from '@/components/Balances';
import Welcome from '@/components/Welcome';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { ChainAddress } from '@/types';
import { Box } from '@mui/material';
import { useBoundStore } from '@/stores/useBoundStore';
import MissingSecretsWarning from '@/components/MissingSecretsWarning';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import Introduction from '@/components/Introduction';
import { useEffect } from 'preact/hooks';
import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { CG_STATIC } from '@/constants';
import { useCoingeckoPricesStore } from '@/hooks/useCoinGeckoPrices';

const MainView: FunctionComponent = () => {
  const wallets = usePersistentAppStore((state) => state.wallets);

  const { chain, wallet } = useBoundStore((state) => ({
    chain: state.activeChain,
    wallet: state.activeWallet,
  }));

  const refreshCoinGeckoPrices = useCoingeckoPricesStore((state) => state.refresh);

  useEffect(() => {
    refreshCoinGeckoPrices(CG_STATIC[chain].id);
  }, [chain]);

  const selectedChainAddress: ChainAddress | undefined =
    chain && wallet ? { chain, address: wallet.walletAddress } : undefined;

  const { coins, markets, refresh: refreshCoinGecko } = useCoingeckoStore();
  if (!coins || !markets) refreshCoinGecko();

  const getCurrentBalance = useAlchemyStore((state) => state.getCurrentBalance);
  const getTransactionsList = useEtherscanStore((state) => state.getTransactionList);

  // Fetch token balances when chainAddress changes
  useEffect(() => {
    if (selectedChainAddress) {
      getCurrentBalance(selectedChainAddress);
      getTransactionsList(selectedChainAddress);
      // historical gets updated elsewhere
    }
  }, [selectedChainAddress]);

  return (
    <Box>
      {wallets.length === 0 ? <Introduction /> : null}
      {selectedChainAddress ? null : <Welcome />}
      {wallets.length > 0 && selectedChainAddress ? <MissingSecretsWarning /> : null}
      <Balances chainAddress={selectedChainAddress} />
    </Box>
  );
};

export default MainView;
