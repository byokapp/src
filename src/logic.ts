import { formatUnits } from 'ethers';
import { mapEntries } from 'radash';
import moment from 'moment';

import { CG_STATIC, DISPLAY_CENTS, zeroString } from './constants';
import { Chain, ChainAddress, Secrets, TimeWindow, numberString } from './types';

const VERBOSE_API_CALLS = true;

export const getTimeWindowLabel = (timeWindow: TimeWindow): string => {
  switch (timeWindow) {
    case TimeWindow.ONE_MONTH:
      return '1M';
    case TimeWindow.THREE_MONTHS:
      return '3M';
    case TimeWindow.SIX_MONTHS:
      return '6M';
    case TimeWindow.YTD:
      return 'YTD';
    case TimeWindow.ONE_YEAR:
      return '1Y';
    case TimeWindow.TWO_YEARS:
      return '2Y';
    default:
      const _exhaustiveCheck: never = timeWindow;
      throw new Error(`Unexpected Time Window: ' + ${_exhaustiveCheck}`);
  }
};
export const getStartAndEndTimestamps = (timeWindow: TimeWindow, endPillar?: number) => {
  const endTimestamp = endPillar ?? Number(moment().endOf('day'));
  const getStartMoment = () => {
    switch (timeWindow) {
      case TimeWindow.ONE_MONTH:
        return moment(endTimestamp).subtract(1, 'month');
      case TimeWindow.THREE_MONTHS:
        return moment(endTimestamp).subtract(3, 'month');
      case TimeWindow.SIX_MONTHS:
        return moment(endTimestamp).subtract(6, 'month');
      case TimeWindow.YTD:
        return moment(endTimestamp).startOf('year');
      case TimeWindow.ONE_YEAR:
        return moment(endTimestamp).subtract(1, 'year');
      case TimeWindow.TWO_YEARS:
        return moment(endTimestamp).subtract(2, 'year');
      default:
        const _exhaustiveCheck: never = timeWindow;
        throw new Error(`Unexpected Time Window: ' + ${_exhaustiveCheck}`);
    }
  };
  const startTimestamp = Number(getStartMoment());
  return [startTimestamp, endTimestamp];
};
export const mapIdToChain = (id: string): Chain | undefined => {
  const invertedCgStatic = mapEntries(CG_STATIC, (k, v) => [v.id, k]);
  return invertedCgStatic[id];
};

export const mapChainToApiKey = (chain: Chain, secrets: Secrets): string | undefined => {
  switch (chain) {
    case Chain.ETH:
      return secrets.etherscan;
    case Chain.MATIC:
      return secrets.polygonscan;
    case Chain.OPTIMISM:
      return secrets['optimistic-etherscan'];
    case Chain.ARBITRUM:
      return secrets.arbiscan;
    case Chain.BASE:
      return secrets.basescan;
    default:
      const _exhaustiveCheck: never = chain;
      throw new Error(`Unexpected chain: ' + ${_exhaustiveCheck}`);
  }
};

export const getEtherFromWei = (
  wei: numberString | null | undefined,
  decimals?: number | null,
): numberString => formatUnits(wei ?? zeroString(), decimals ?? 18);

export const logExternalApiCalls = (apiName: string, message: string) => {
  if (VERBOSE_API_CALLS) {
    console.log(`${apiName}:${message}`);
  }
};

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const commifyNumberString = (
  val: string | null | undefined,
  digits: number,
): string | null | undefined => {
  if (!val) return val;
  const valNumber: number = Number(val);
  return valNumber.toLocaleString('en-us', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const dollarify = (val: number): string =>
  `$${commifyNumberString(val.toString(), DISPLAY_CENTS)}`;

export const shortenHash = (value?: string | null, digits?: number): string =>
  value
    ? `${value.slice(0, (digits ?? 4) + 2)}...${value.slice(value.length - (digits ?? 4))}`
    : '';

export const contractEquals = (address1: string, address2: string): boolean =>
  address1.toLowerCase() === address2.toLowerCase();

export const chainAddressEquals = (
  ca1: ChainAddress | undefined,
  ca2: ChainAddress | undefined,
): boolean => {
  if (!ca1 || !ca2) return false;
  return ca1.chain === ca2.chain && contractEquals(ca1.address, ca2.address);
};
export const chainAddressUniqueId = (ca: ChainAddress): string => [ca.chain, ca.address].join(':');
