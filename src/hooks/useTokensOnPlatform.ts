import { useCoingeckoStore } from './useCoinGecko';

export const useTokensOnPlatform = () => {
  const coins = useCoingeckoStore((state) => state.coins);
  const coingeckoMetadata = coins ?? [];

  const tokensOnPlatform = new Map<string, string>();
  coingeckoMetadata.forEach((md) => {
    const platforms = md.platforms;
    for (const [key, value] of Object.entries(platforms)) {
      const contractChainAddress = [key, value].join(':');
      tokensOnPlatform.set(contractChainAddress, md.id);
    }
  });
  return tokensOnPlatform;
};
