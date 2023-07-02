export type urlString = string;
export type numberString = string;
export type hexString = string;
export type SecretsKey =
  | 'alchemy'
  | 'etherscan'
  | 'polygonscan'
  | 'optimistic-etherscan'
  | 'arbiscan';
export type Secrets = {
  [key in SecretsKey]?: string;
};
export enum Chain {
  ETH = 'ETH_MAINNET',
  MATIC = 'MATIC',
  ARBITRUM = 'ARBITRUM',
  OPTIMISM = 'OPTIMISM',
}
export enum TimeWindow {
  ONE_MONTH = '1_MONTH',
  THREE_MONTHS = '3_MONTHS',
  SIX_MONTHS = '6_MONTHS',
  YTD = 'YTD',
  ONE_YEAR = '1_YEAR',
  TWO_YEARS = '2_YEARS',
}
export interface ChartPoint {
  x: number;
  y: number;
}
export type Address = string;
export interface Wallet {
  id: number | undefined;
  walletName: string;
  walletAddress: Address;
}
export interface ChainAddress {
  address: Address;
  chain: Chain;
}
export interface Erc20Balance {
  contractAddress: Address;
  tokenBalance: hexString;
}
export interface CurrentBalance {
  chainAddress: ChainAddress;
  timestamp: number;
  nativeBalance: numberString;
  erc20?: Erc20Balance[];
}
export interface BalanceHistory {
  chainAddress: ChainAddress;
  blockNumber: number;
  nativeBalance: numberString;
  erc20?: Erc20Balance[];
}
export interface ChainDetail {
  id: string; // CoinGecko id
  name: string;
  nativeAssetId: string; // CoinGecko id
  symbol: string;
  decimals: number; // for the native asset of this chain
  platform: string; // CoinGecko platform
  image: urlString; // CoinGecko hosted
  blockscan: string;
  blockscanUrl: urlString;
}
export interface Erc20ContractDetail {
  chain: Chain;
  address: Address;
  decimals: number;
  symbol: string;
}
export interface Asset {
  id: string; // CoingGecko id
  details: ChainDetail | Erc20ContractDetail;
}
export interface MediaCard {
  src: urlString;
  tooltip: string;
  title: string;
  attributionHref: urlString;
  attributionText: string;
}
