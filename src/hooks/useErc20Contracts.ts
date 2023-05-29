import { ChainAddress, Erc20ContractDetail } from '@/types';

import { useCoingeckoStore } from './useCoinGecko';
import { sift, unique } from 'radash';
import { useEtherscanStore } from './useEtherscan';
import { chainAddressEquals } from '@/logic';
import { CG_STATIC } from '@/constants';
import { useTokensOnPlatform } from './useTokensOnPlatform';

interface Props {
  chainAddress: ChainAddress;
}
export const useErc20Contracts = ({ chainAddress }: Props): Erc20ContractDetail[] => {
  const { chain } = chainAddress;

  const { coins, metadata } = useCoingeckoStore();
  const coingeckoMetadata = coins ?? [];

  const txnLists = useEtherscanStore((state) => state.txnLists);
  const etherscanTxList =
    txnLists.find((tl) => chainAddressEquals(tl.chainAddress, chainAddress))?.txnList ?? [];

  const tokensOnPlatform = useTokensOnPlatform();

  const seenContracts = sift(unique(etherscanTxList.map((i) => i.contractAddress)));
  const tokenAddress = new Map<string, string>();
  const seenTokens = sift(
    seenContracts.map((contractAddress) => {
      const key = [CG_STATIC[chain].platform, contractAddress].join(':');
      const val = tokensOnPlatform.get(key);
      const maybeSymbol = coingeckoMetadata.find((md) => md.id === val)?.symbol;
      if (maybeSymbol) {
        tokenAddress.set(maybeSymbol, contractAddress);
      }
      return maybeSymbol;
    }),
  );

  const erc20Contracts = sift(
    seenTokens.map((token) => {
      const address = tokenAddress.get(token) ?? undefined;
      const tokenMetadata = metadata?.find((md) => md.symbol === token);
      const decimals =
        tokenMetadata?.detail_platforms[CG_STATIC[chain].platform].decimal_place ?? 18;
      const symbol = tokenMetadata?.symbol ?? token;
      return address ? { chain, address, decimals, symbol } : undefined;
    }),
  );

  return erc20Contracts;
};
