import axios from 'axios';
import { memo, sort, unique } from 'radash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { chainAddressUniqueId, logExternalApiCalls, mapChainToApiKey } from '@/logic';
import { Chain, ChainAddress, numberString } from '@/types';
import { usePersistentAppStore } from '@/stores/persistentAppState';
import { LOCAL_STORAGE_KEY, TTL } from '@/constants';

const BASE_URL = {
  [Chain.ETH]: `https://api.etherscan.io/api?module=account`,
  [Chain.MATIC]: `https://api.polygonscan.com/api?module=account`,
  [Chain.OPTIMISM]: `https://api-optimistic.etherscan.io/api?module=account`,
  [Chain.ARBITRUM]: `https://api.arbiscan.io/api?module=account`,
};

interface EtherscanGenericResponse {
  status: string;
  message: string;
  result: EtherscanTxListGenericResponse[];
}
export interface EtherscanTxListGenericResponse {
  blockNumber: numberString;
  timeStamp: numberString;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  to: string;
  value: numberString;
  contractAddress?: string;
}

interface TransactionList {
  chainAddress: ChainAddress;
  txnList: EtherscanTxListGenericResponse[];
}
type EtherscanState = {
  txnLists: TransactionList[];
};
type EtherscanActions = {
  getTransactionList: (chainAddress: ChainAddress) => void;
};
const initialState: EtherscanState = {
  txnLists: [],
};
export const useEtherscanStore = create<EtherscanState & EtherscanActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getTransactionList: async (chainAddress) => {
        const prevState = get().txnLists;

        const tokentx = await worker(chainAddress, 'tokentx');
        const txlist = await worker(chainAddress, 'txlist');
        const txlistinternal = await worker(chainAddress, 'txlistinternal');
        const tokennfttx = await worker(chainAddress, 'tokennfttx');

        // radash unique(...) preserves first, drops second
        const txnList = unique(
          sort([...tokennfttx, ...tokentx, ...txlistinternal, ...txlist], (a) =>
            Number(a.blockNumber),
          ),
          (r) => r.hash,
        );

        // radash unique(...) preserves first, drops second
        const freshTxnList: TransactionList = { chainAddress, txnList };
        const txnLists = unique([freshTxnList, ...prevState], (l) =>
          chainAddressUniqueId(l.chainAddress),
        );
        set({ txnLists });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.Etherscan.transactions` },
  ),
);

const _worker = async (
  chainAddress: ChainAddress,
  action: string,
): Promise<EtherscanTxListGenericResponse[]> => {
  const { chain, address } = chainAddress;

  const secrets = usePersistentAppStore.getState().secrets;
  const maybeApiKey = mapChainToApiKey(chain, secrets);

  logExternalApiCalls(`Etherscan[${chain}]`, `address=${address}&action=${action}`);
  const res = await axios.get<EtherscanGenericResponse>(
    `${BASE_URL[chain]}${
      maybeApiKey ? `&apikey=${maybeApiKey}` : ''
    }&address=${address}&action=${action}&startblock=0&sort=asc`,
  );
  if (res.data.status && res.data.status !== '0') {
    return res.data.result;
  } else {
    return [];
  }
};
const worker = memo(_worker, { ttl: TTL['CHAIN'] });
