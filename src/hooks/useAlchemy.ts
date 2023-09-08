import {
  Alchemy,
  BlockTag,
  Network,
  TokenBalancesResponseErc20,
  TokenBalanceType,
  Utils,
} from 'alchemy-sdk';
import * as ethers from 'ethers';
import { debounce, diff, memo, parallel, unique } from 'radash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CG_STATIC, LOCAL_STORAGE_KEY, TTL, zeroString } from '@/constants';
import {
  chainAddressEquals,
  chainAddressUniqueId,
  getEtherFromWei,
  logExternalApiCalls,
} from '@/logic';
import { BalanceHistory, Chain, ChainAddress, CurrentBalance, Erc20ContractDetail } from '@/types';
import { usePersistentAppStore } from '@/stores/persistentAppState';

const DEBOUNCE_INPUTS = 500; // 0.5 seconds

type AlchemyState = {
  currentBalances: CurrentBalance[];
  historicalBalances: BalanceHistory[];
};
type AlchemyActions = {
  getCurrentBalance: (chainAddress: ChainAddress) => void;
  getHistoricalBalance: (
    chainAddress: ChainAddress,
    blockNumbers: number[],
    contracts: Erc20ContractDetail[],
  ) => void;
};
const initialState: AlchemyState = {
  currentBalances: [],
  historicalBalances: [],
};
export const useAlchemyStore = create<AlchemyState & AlchemyActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      getCurrentBalance: async (chainAddress) => {
        const prevState = get().currentBalances;

        const { address, chain } = chainAddress;
        const network = mapChainToNetwork(chain);

        const res = await _getAlchemyBalance(network, address);
        const timestamp = Date.now();
        const nativeBalance = getEtherFromWei(res.toString(), CG_STATIC[chain].decimals);

        const res2 = await _getAlchemyTokenBalances(network, address);
        const erc20 = res2.tokenBalances.map((tb) => ({
          contractAddress: tb.contractAddress,
          tokenBalance: tb.tokenBalance ?? zeroString(), // this is in decimals, not units
        }));

        const updatedBalance: CurrentBalance = {
          chainAddress,
          timestamp,
          nativeBalance,
          erc20,
        };
        // radash unique(...) preserves first, drops second
        const currentBalances = unique([updatedBalance, ...prevState], (currentBalance) =>
          chainAddressUniqueId(currentBalance.chainAddress),
        );
        set({ currentBalances });
      },
      getHistoricalBalance: async (chainAddress, blockNumbers, contracts) => {
        const prevState = get().historicalBalances;

        const { address, chain } = chainAddress;
        const network = mapChainToNetwork(chain);

        // filter out blockNumbers we've already seen on chainAddress
        const seenBlockNumbers = unique(
          prevState
            .filter((s) => chainAddressEquals(s.chainAddress, chainAddress))
            .map((bh) => bh.blockNumber),
        );
        const unseenBlockNumbers = diff(blockNumbers, seenBlockNumbers);

        const res = await parallel(2, unseenBlockNumbers, async (blockNumber) => {
          const nativeBalance = await _getBalanceAtBlock(network, chain, address, blockNumber);
          const erc20 = await parallel(2, contracts, async (contract) => {
            const balance = await _getErc20BalanceAtBlock(address, contract, blockNumber);
            return { contractAddress: contract.address, tokenBalance: balance };
          });
          const chainAddress = { chain, address: address };
          const balanceHistoryItem: BalanceHistory = {
            chainAddress,
            blockNumber,
            erc20,
            nativeBalance,
          };
          return balanceHistoryItem;
        });

        // radash unique(...) preserves first, drops second
        const historicalBalances = unique([...res, ...prevState], (currentBalance) =>
          [chainAddressUniqueId(currentBalance.chainAddress), currentBalance.blockNumber].join(':'),
        );
        set({ historicalBalances });
      },
    }),
    { name: `${LOCAL_STORAGE_KEY}.Alchemy.balances` },
  ),
);

const getAlchemyClient = (network: Network): Alchemy => {
  const secrets = usePersistentAppStore.getState().secrets;
  const settings = {
    apiKey: secrets.alchemy,
    network,
  };
  const alchemyClient = new Alchemy(settings);
  return alchemyClient;
};

export const mapChainToNetwork = (chain: Chain): Network => {
  switch (chain) {
    case Chain.ETH:
      return Network.ETH_MAINNET;
    case Chain.ARBITRUM:
      return Network.ARB_MAINNET;
    case Chain.OPTIMISM:
      return Network.OPT_MAINNET;
    case Chain.MATIC:
      return Network.MATIC_MAINNET;
    case Chain.BASE:
      return Network.BASE_MAINNET;
    default:
      const _exhaustiveCheck: never = chain;
      throw new Error(`Unexpected chain: ' + ${_exhaustiveCheck}`);
  }
};

const _getAlchemyBalance = memo(
  async (network: Network, address: string, blockTag?: BlockTag) => {
    const alchemyClient = getAlchemyClient(network);
    const res = await alchemyClient.core.getBalance(address);
    logExternalApiCalls('Alchemy', `balance (${blockTag ?? 'latest'}) ${network}]:${res}`);
    return res;
  },
  { ttl: TTL['CHAIN'] },
);

const _getAlchemyTokenBalances = memo(
  async (network: Network, address: string) => {
    // Token API not supported yet on Base 2023-09-08
    if (network === Network.BASE_MAINNET) {
      const empty: TokenBalancesResponseErc20 = {
        address: address,
        tokenBalances: [],
      };
      return empty;
    }

    const alchemyClient = getAlchemyClient(network);
    const res: TokenBalancesResponseErc20 = await alchemyClient.core.getTokenBalances(address, {
      type: TokenBalanceType.ERC20,
    });
    logExternalApiCalls('Alchemy', `balances[${network}] (${res.tokenBalances.length})`);
    return res;
  },
  { ttl: TTL['CHAIN'] },
);

const _getEnsAddress = async (ensName: string, setEnsAddress: (address: string | null) => void) => {
  const network = Network.ETH_MAINNET; // ENS is an ETH mainnet concept

  const alchemyClient = getAlchemyClient(network);
  const res = await alchemyClient.core.resolveName(ensName);
  logExternalApiCalls('Alchemy', `:ENS name [${network}] for ${ensName}`);

  setEnsAddress(res);
};
export const getEnsAddress = debounce({ delay: DEBOUNCE_INPUTS }, _getEnsAddress);

const _getBalanceAtBlock = memo(
  async (network: Network, chain: Chain, address: string, blockNumber: number) => {
    const alchemyClient = getAlchemyClient(network);
    const singleton = await alchemyClient.core.getBalance(address, blockNumber);
    const nativeBalance = getEtherFromWei(singleton.toString(), CG_STATIC[chain].decimals);
    logExternalApiCalls(
      'Alchemy',
      `balance at block [${network}] ${address} ${blockNumber}: ${nativeBalance}`,
    );
    return nativeBalance;
  },
  { ttl: TTL['CHAIN'] },
);
const _getErc20BalanceAtBlock = memo(
  async (walletAddress: string, contract: Erc20ContractDetail, blockNumber: number) => {
    try {
      const network = mapChainToNetwork(contract.chain);
      const alchemyClient = getAlchemyClient(network);
      const abi = ['function balanceOf(address account)'];
      const iface = new ethers.Interface(abi);
      const hexBalance = await alchemyClient.core.call(
        {
          to: contract.address,
          data: iface.encodeFunctionData('balanceOf', [walletAddress]),
        },
        blockNumber,
      );
      const balance = getEtherFromWei(Utils.hexValue(hexBalance), contract.decimals);
      logExternalApiCalls(
        'Alchemy',
        `ERC20 balance at block ${blockNumber} [${network}] ${walletAddress} ${contract.symbol}: ${balance}`,
      );
      return balance.toString();
    } catch {
      // swallow error
      return zeroString();
    }
  },
  { ttl: TTL['CHAIN'] },
);
