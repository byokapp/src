import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEY } from '@/constants';
import { logExternalApiCalls } from '@/logic';
import { unique } from 'radash';

const BASE_URL = 'https://api.coingecko.com/api/v3/coins';

export interface CGKnownCoin {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [platform: string]: string;
  };
}
export interface CGMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  last_updated: string;
}
interface CGTokenMetadata {
  id: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  detail_platforms: {
    [platform: string]: { decimal_place: number; contract_address: string };
  };
  last_updated: string;
  symbol: string;
}
type CGState = {
  coins?: CGKnownCoin[];
  markets?: CGMarket[];
  metadata?: CGTokenMetadata[];
};
type CGActions = {
  reset: () => void;
  refresh: () => void;
  update: (id: string) => void;
};
const initialState: CGState = {
  coins: undefined,
  markets: undefined,
  metadata: undefined,
};
export const useCoingeckoStore = create<CGState & CGActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      refresh: async () => {
        const coins = await knownCoins();
        const markets = await top100Coins();
        const metadata = get().metadata;
        set({ coins, markets, metadata });
      },
      reset: () => set(initialState),
      update: async (id: string) => {
        const prevMetadata = get().metadata ?? [];
        if (prevMetadata.find((md) => md.id === id)) return;

        const newMetadata = (await coinMetadata(id)) ?? [];
        // radash unique(...) preserves first, drops second
        set({ metadata: unique([...newMetadata, ...prevMetadata], (m) => m.id) });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.CG.meta` },
  ),
);

const knownCoins = async () => {
  logExternalApiCalls('Coingecko(static cache)', 'knownCoins');
  const ret = await axios.get<CGKnownCoin[]>(`${BASE_URL}/list?include_platform=true`);
  return ret.data;
};

const top100Coins = async () => {
  logExternalApiCalls('Coingecko(static cache)', 'top100prices');
  const ret = await axios.get<CGMarket[]>(
    `${BASE_URL}/markets?vs_currency=usd&order=market_cap_desc&per_page=500&page=1&sparkline=false&locale=en`,
  );
  return ret.data;
};

const coinMetadata = async (id: string) => {
  logExternalApiCalls('Coingecko(static cached)', id);
  const ret = await axios.get<CGTokenMetadata | undefined>(
    `${BASE_URL}/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`,
  );
  return ret.data ? [ret.data] : undefined;
};
