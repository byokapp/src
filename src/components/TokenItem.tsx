import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import BalanceItem from './BalanceItem';

import { CG_STATIC } from '@/constants';
import { chainAddressEquals, getEtherFromWei } from '@/logic';
import { ChainAddress, Erc20Balance } from '@/types';
import { useCoingeckoStore } from '@/hooks/useCoinGecko';
import { getLatestPrice, useCoingeckoPricesStore } from '@/hooks/useCoinGeckoPrices';
import { useTokensOnPlatform } from '@/hooks/useTokensOnPlatform';
import { useErc20Contracts } from '@/hooks/useErc20Contracts';
import { usePersistentBalancesStore } from '@/stores/persistentBalancesState';

type TokenItemProps = {
  tbItem: Erc20Balance;
  chainAddress: ChainAddress;
  showAvatar?: boolean;
};
const TokenItem: FunctionComponent<TokenItemProps> = ({ tbItem, chainAddress, showAvatar }) => {
  const { chain } = chainAddress;

  const erc20Contracts = useErc20Contracts({ chainAddress });
  const token = erc20Contracts.find((contractDetail) =>
    chainAddressEquals(contractDetail, { chain, address: tbItem.contractAddress }),
  );
  if (!token) return null;

  const tokensOnPlatform = useTokensOnPlatform();

  const { metadata, updateTokenMetadata } = useCoingeckoStore((state) => ({
    metadata: state.metadata,
    updateTokenMetadata: state.update,
  }));
  const { updatePrices } = useCoingeckoPricesStore((state) => ({ updatePrices: state.refresh }));
  const tokenBalanceReducer = usePersistentBalancesStore((state) => state.tokenBalanceReducer);

  const { contractAddress, tokenBalance } = tbItem;

  const coingeckoCoinId = tokensOnPlatform.get(
    [CG_STATIC[chain].platform, contractAddress].join(':'),
  );
  if (!coingeckoCoinId) return null;

  useEffect(() => {
    if (coingeckoCoinId) {
      updatePrices(coingeckoCoinId);
      updateTokenMetadata(coingeckoCoinId);
    }
  }, [coingeckoCoinId]);
  const tokenMetadata = metadata?.find((md) => md.id === coingeckoCoinId);
  if (!tokenMetadata) return null;

  const symbol = token.symbol;
  const logo = tokenMetadata.image.small;
  const decimals = tokenMetadata.detail_platforms[CG_STATIC[chain].platform].decimal_place;

  const unitsStr = getEtherFromWei(tokenBalance, decimals);

  const { timestamp: last_updated, price: current_price } = getLatestPrice({
    id: coingeckoCoinId,
  });
  const balanceUsd = Number(unitsStr) * (current_price ?? 0);

  useEffect(() => {
    tokenBalanceReducer({ chainAddress, contractAddress, tokenBalanceUsd: balanceUsd });
  }, [chainAddress.chain, chainAddress.address, contractAddress, balanceUsd]);

  return (
    <BalanceItem
      balanceUsd={balanceUsd}
      unitsStr={unitsStr}
      symbol={symbol}
      logo={logo}
      currentPrice={current_price}
      lastUpdated={last_updated}
      showAvatar={true}
    />
  );
};
export default TokenItem;
