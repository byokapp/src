import { Chain, ChainDetail, SecretsKey, urlString } from './types';

/*
 Ξ BYOK App
 by artlu.lens | @artlu99
*/
export const APPNAME = '🗝️BYOK App';
export const LOCAL_STORAGE_KEY = 'BYOK';
export const VERBOSE_API_CALLS = true;

export const DATETIME_FORMAT = 'M/D/Y h:mm:ss A'; // moment.js
export const DISPLAY_CENTS = 2;
export const DISPLAY_DECIMALS = 4;

export const TTL = {
  CHAIN: 2 * 60 * 1000, // 2 minutes
  PRICES: 1 * 60 * 60 * 1000, // 1 hour
  METADATA: 4 * 60 * 60 * 1000, // 4 hours
};

export const SECRETS_KEYS: SecretsKey[] = [
  'alchemy',
  'etherscan',
  'polygonscan',
  'optimistic-etherscan',
  'arbiscan',
];
export const SUPPORTED_CHAINS = [Chain.ETH, Chain.MATIC, Chain.ARBITRUM, Chain.OPTIMISM];

// these values mostly come from CoinGecko. Storing as constants for convenience
export const CG_STATIC: { [chain in Chain]: ChainDetail } = {
  ETH_MAINNET: {
    id: 'ethereum',
    name: 'Ethereum',
    nativeAssetId: 'ethereum',
    symbol: 'ETH',
    decimals: 18,
    platform: 'ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    etherscan: 'Etherscan',
  },
  MATIC: {
    id: 'matic-network',
    name: 'Polygon',
    nativeAssetId: 'matic-network',
    symbol: 'MATIC',
    decimals: 18,
    platform: 'polygon-pos',
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    etherscan: 'Polygonscan',
  },
  ARBITRUM: {
    id: 'arbitrum',
    name: 'Arbitrum',
    nativeAssetId: 'ethereum',
    symbol: 'Arbitrum ETH',
    decimals: 18,
    platform: 'arbitrum-one',
    image:
      'https://assets.coingecko.com/coins/images/16547/large/photo_2023-03-29_21.47.00.jpeg?1680097630',
    etherscan: 'Arbiscan',
  },
  OPTIMISM: {
    id: 'optimism',
    name: 'Optimism',
    nativeAssetId: 'ethereum',
    symbol: 'Optimism ETH',
    decimals: 18,
    platform: 'optimistic-ethereum',
    image: 'https://assets.coingecko.com/coins/images/25244/large/Optimism.png?1660904599',
    etherscan: 'Optimistic Etherscan',
  },
};

export const ENS_IMAGE: urlString =
  'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg?1635850140';

export const SAFE_ICON: urlString = 'https://app.safe.global/favicons/favicon.ico';

export const zeroString = () => '0';
export const coinGeckoAttribution = () => 'Powered by CoinGecko';
export const missingAlchemyApiKey = () =>
  'Provide your own Alchemy API key via Secrets Manager 🌩️ (data likely incomplete due to rate-limiting)';
export const missingEtherscanApiKey = (chain: Chain) =>
  `Provide your own ${CG_STATIC[chain].etherscan} API key via Secrets Manager 🌩️ (data likely incorrect without API key) `;
