import axios from 'axios';
import { max, memo, unique } from 'radash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOCAL_STORAGE_KEY, TTL } from '@/constants';
import { logExternalApiCalls } from '@/logic';

const BASE_URL = 'https://api.coingecko.com/api/v3/coins';

export type Price = [number, number];
interface CGMarketChartResponse {
  prices: Price[];
}
interface TokenPrices {
  id: string;
  prices: Price[];
}
type CGPricesState = {
  tokens: TokenPrices[];
};
type CGPricesActions = {
  refresh: (id: string) => void;
};
const initialState: CGPricesState = { tokens: [] };
export const useCoingeckoPricesStore = create<CGPricesState & CGPricesActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      refresh: async (id: string) => {
        const prevPricesSet = get().tokens;
        const newPrices = [await getHistoricalPrices(id)];
        // radash unique(...) preserves first, drops second
        set({ tokens: unique([...newPrices, ...prevPricesSet], (p) => p.id) });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.CG.prices` },
  ),
);

const getHistoricalPrices = memo(
  async (id: string) => {
    const days = 730;
    logExternalApiCalls('Coingecko', `price(memo'd + cached)[${id}]`);
    const ret = await axios.get<CGMarketChartResponse>(
      `${BASE_URL}/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    );
    return { id, prices: ret.data.prices };
  },
  {
    ttl: TTL['PRICES'],
  },
);

export const getLatestPrice = (params: {
  id: string | undefined;
  asof?: string; // timestampStr
}): { timestamp: number | undefined; price: number | undefined } => {
  const { tokens } = useCoingeckoPricesStore();

  const { id, asof } = params;
  const notFound = { timestamp: undefined, price: undefined };
  const tokenPrices = tokens.find((token) => token.id === id);
  if (!id || !tokenPrices) return notFound;

  const asofTs = Number(asof) * 1000;
  const prices = asof ? tokenPrices.prices.filter((tp) => tp[0] <= asofTs) : tokenPrices.prices;

  const latest = max(prices, (tp) => tp[0]);
  const [timestamp, price] = latest ?? [undefined, undefined];
  return { timestamp, price };
};
