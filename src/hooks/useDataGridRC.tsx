import { Link, Link2 } from 'preact-feather';
import { GridColDef, GridRenderCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import moment from 'moment';

import { CG_STATIC, DATETIME_FORMAT, zeroString } from '@/constants';
import { getLatestPrice } from '@/hooks/useCoinGeckoPrices';
import { EtherscanTxListGenericResponse } from '@/hooks/useEtherscan';
import { useTokensOnPlatform } from '@/hooks/useTokensOnPlatform';
import { commifyNumberString, contractEquals, shortenHash } from '@/logic';
import { BalanceHistory, Chain, ChainAddress, Erc20ContractDetail } from '@/types';

import ExternalLink from '@/components/ExternalLink';
import BalanceItem from '@/components/BalanceItem';

export const useDataGridRC = (
  chainAddress: ChainAddress,
  erc20Contracts: Erc20ContractDetail[],
  txns: EtherscanTxListGenericResponse[],
  balanceHistory: BalanceHistory[],
) => {
  const tokensOnPlatform = useTokensOnPlatform();

  const { chain } = chainAddress;
  const blockscanBaseUrl = CG_STATIC[chain].blockscanUrl;

  const columns: GridColDef[] = [
    { field: 'blockNumber', headerName: 'BlockNumber', width: 130, editable: false },
    { field: 'timestamp', headerName: 'TimeStamp', width: 170, editable: false },
    {
      field: CG_STATIC[chain].symbol,
      headerName: CG_STATIC[chain].symbol,
      width: 170,
      editable: false,
      renderCell: ({ value }) => value,
    },
    ...erc20Contracts.map((token) => ({
      field: token.symbol,
      headerName: token.symbol,
      width: 130,
      editable: false,
      renderCell: (params: GridRenderCellParams) => params.value,
    })),
    {
      field: 'blockscanLink',
      headerName: 'Etherscan',
      width: 90,
      sortable: false,
      description: 'external Etherscan link (not sortable)',
      editable: false,
      renderCell: ({ value }) => {
        return (
          <ExternalLink href={value}>
            <Link />
          </ExternalLink>
        );
      },
    },
    {
      field: 'ethtxInfoLink',
      headerName: 'ethtx.info',
      width: 70,
      sortable: false,
      description: 'external ethtx.info link (not sortable)',
      editable: false,
      renderCell: ({ value }) => {
        return value ? (
          <ExternalLink href={value}>
            <Link2 />
          </ExternalLink>
        ) : undefined;
      },
    },
    {
      field: 'txnHash',
      headerName: 'Transaction Hash',
      width: 130,
      editable: false,
      valueFormatter: (params: GridValueFormatterParams<string>) => shortenHash(params.value),
    },
    {
      field: 'nativeBalance',
      headerName: 'nativeBalance',
      width: 130,
      editable: false,
    },
    {
      field: 'balanceUsd',
      headerName: 'nativeBalanceUsd',
      width: 130,
      editable: false,
    },
    {
      field: 'currentPrice',
      headerName: 'currentPrice',
      width: 130,
      editable: false,
    },
    {
      field: 'lastUpdated',
      headerName: 'lastUpdated',
      width: 130,
      editable: false,
    },
  ];

  const rows = txns.map((txn, idx) => {
    const { timeStamp, blockNumber, hash } = txn;
    const timestampStr = moment(new Date(parseInt(timeStamp, 10) * 1000))
      .local()
      .format(DATETIME_FORMAT);
    const blockNumberAsNumber = Number(BigInt(blockNumber));
    const maybeBalanceHistoryItem = balanceHistory.find(
      (bh) => bh.blockNumber === blockNumberAsNumber,
    );
    const nativeBalance = maybeBalanceHistoryItem?.nativeBalance;
    const { timestamp: lastUpdated, price: currentPrice } = getLatestPrice({
      id: CG_STATIC[chain].nativeAssetId,
      asof: timeStamp,
    });
    const balanceUsd = Number(nativeBalance ?? zeroString()) * (currentPrice ?? 0);

    const erc20ContractsBalances = Object.fromEntries(
      erc20Contracts.map((token) => {
        const { address: contractAddress } = token;
        const maybeCoingeckoCoinId = tokensOnPlatform.get(
          [CG_STATIC[chain].platform, contractAddress].join(':'),
        );
        const maybeBalance = maybeBalanceHistoryItem?.erc20?.find((erc20) =>
          contractEquals(erc20.contractAddress, token.address),
        );
        const balance = maybeBalance?.tokenBalance;
        const { timestamp: lastUpdated, price: currentPrice } = getLatestPrice({
          id: maybeCoingeckoCoinId,
          asof: timeStamp,
        });
        const balanceUsd = Number(balance) * (currentPrice ?? 0);

        return [
          token.symbol,
          <BalanceItem
            balanceUsd={balanceUsd}
            unitsStr={balance}
            currentPrice={currentPrice}
            lastUpdated={lastUpdated}
          />,
        ];
      }),
    );
    return {
      id: idx,
      blockNumber: commifyNumberString(blockNumber, 0),
      timestamp: timestampStr,
      txnHash: hash,
      blockscanLink: `${blockscanBaseUrl}/tx/${hash}`,
      ethtxInfoLink: chain === Chain.ETH ? `https://ethtx.info/mainnet/${hash}/` : undefined,
      [CG_STATIC[chain].symbol]: (
        <BalanceItem
          balanceUsd={balanceUsd}
          unitsStr={nativeBalance}
          currentPrice={currentPrice}
          lastUpdated={lastUpdated}
        />
      ),
      ...erc20ContractsBalances,
      unixTimestamp: timeStamp,
      nativeBalance,
      balanceUsd,
      currentPrice,
      lastUpdated,
    };
  });

  return { rows, columns };
};
