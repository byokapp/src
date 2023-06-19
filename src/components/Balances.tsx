import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { sort, unique } from 'radash';
import { Box, Divider, Stack, Typography } from '@mui/material';

import { CG_STATIC, coinGeckoAttribution, zeroString } from '@/constants';
import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { getLatestPrice } from '@/hooks/useCoinGeckoPrices';
import { useErc20Contracts } from '@/hooks/useErc20Contracts';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { chainAddressEquals } from '@/logic';
import { usePersistentBalancesStore } from '@/stores/persistentBalancesState';
import { ChainAddress } from '@/types';

import BalanceItem from '@/components/BalanceItem';
import TokenItem from '@/components/TokenItem';
import TransactionList from '@/components/TransactionList';
import TripleChart from '@/components/TripleChart';

interface BalancesProps {
  chainAddress: ChainAddress | undefined;
}
const Balances: FunctionComponent<BalancesProps> = ({ chainAddress }) => {
  if (!chainAddress) return null;
  const { address, chain } = chainAddress;

  const { markets } = useCoingeckoStore();
  const top100Coins = markets ?? [];

  const [balancesReducer, totalBalanceReducer] = usePersistentBalancesStore((state) => [
    state.balancesReducer,
    state.totalBalanceReducer,
  ]);

  const txnLists = useEtherscanStore((state) => state.txnLists);
  const etherscanTxList =
    txnLists.find((tl) => chainAddressEquals(tl.chainAddress, chainAddress))?.txnList ?? [];

  const [currentBalances, historicalBalances, getHistoricalBalance] = useAlchemyStore((state) => [
    state.currentBalances,
    state.historicalBalances,
    state.getHistoricalBalance,
  ]);
  const balanceHistory =
    historicalBalances.filter((hb) => chainAddressEquals(hb.chainAddress, chainAddress)) ?? [];

  const erc20Contracts = useErc20Contracts({ chainAddress });

  const blockNumbers = sort(
    unique(
      etherscanTxList.map((l) => Number(BigInt(l.blockNumber))),
      (l) => l,
    ),
    (l) => l,
  );

  useEffect(() => {
    if (blockNumbers.length !== balanceHistory.length)
      getHistoricalBalance(chainAddress, blockNumbers, erc20Contracts);
  }, [chainAddress.chain, chainAddress.address]);

  const coingeckoSemistaticData = top100Coins.find(
    (coinData) => coinData.id === CG_STATIC[chain].nativeAssetId,
  );
  if (!coingeckoSemistaticData) return null;

  const image = coingeckoSemistaticData.image as string;
  const symbol = coingeckoSemistaticData.symbol as string;

  const { timestamp: last_updated, price: current_price } = getLatestPrice({
    id: CG_STATIC[chain].nativeAssetId,
  });
  const currentBalance = currentBalances.find((balance) =>
    chainAddressEquals(balance.chainAddress, { chain, address }),
  );
  const nativeBalance = currentBalance?.nativeBalance;
  const tokensBalance = currentBalance?.erc20;
  const nativeBalanceUsd = Number(nativeBalance ?? zeroString()) * (current_price ?? 0);

  useEffect(() => {
    balancesReducer({
      chainAddress,
      timestamp: currentBalance?.timestamp ?? Date.now(),
      nativeBalance: nativeBalance ?? zeroString(),
      nativeBalanceUsd,
      erc20: tokensBalance,
    });
    totalBalanceReducer();
  }, [chainAddress.chain, chainAddress.address, nativeBalance, nativeBalanceUsd]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h6">Current Balances</Typography>
      <Typography variant="caption" display="block" gutterBottom>
        {coinGeckoAttribution()}
      </Typography>
      <Stack direction="row" spacing={2}>
        <BalanceItem
          balanceUsd={nativeBalanceUsd}
          unitsStr={nativeBalance}
          symbol={symbol.toLocaleUpperCase()}
          logo={image}
          currentPrice={current_price}
          lastUpdated={last_updated}
          showAvatar={true}
          showChainBadge={
            CG_STATIC[chain].id !== CG_STATIC[chain].nativeAssetId ? CG_STATIC[chain].image : null
          }
        />
        <Divider orientation="vertical" flexItem />
        {tokensBalance?.map((tbItem, index) => (
          <TokenItem key={index} tbItem={tbItem} chainAddress={chainAddress} showAvatar={true} />
        ))}
      </Stack>
      <TripleChart chainAddress={chainAddress} />
      <TransactionList chainAddress={chainAddress} />
      <Typography variant="caption" display="block" gutterBottom>
        {coinGeckoAttribution()}
      </Typography>
    </Box>
  );
};

export default Balances;
