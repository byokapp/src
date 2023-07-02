import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Box } from '@mui/material';

import { CG_STATIC } from '@/constants';
import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { useCoingeckoPricesStore } from '@/hooks/useCoinGeckoPrices';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { useBoundStore } from '@/stores/useBoundStore';
import { ChainAddress } from '@/types';

import Introduction from '@/components/Introduction';
import Balances from '@/components/Balances';
import Welcome from '@/components/Welcome';
import MissingSecretsWarning from '@/components/MissingSecretsWarning';

const MainView: FunctionComponent = () => {
  const [wallets, walletId] = usePersistentAppStore((state) => [
    state.wallets,
    state.activeWalletId,
  ]);
  const chain = useBoundStore((state) => state.activeChain);
  const wallet = wallets.find((w) => w.id === walletId);

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
      <Balances chainAddress={selectedChainAddress} />
      {wallets.length > 0 && selectedChainAddress ? <MissingSecretsWarning /> : null}
    </Box>
  );
};

export default MainView;
