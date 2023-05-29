import { FunctionComponent } from 'preact';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

import { chainAddressEquals } from '@/logic';
import { ChainAddress, Erc20ContractDetail } from '@/types';
import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { useErc20Contracts } from '@/hooks/useErc20Contracts';
import { useDataGridRC } from '@/hooks/useDataGridRC';

const GridToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
};

interface TransactionListProps {
  chainAddress: ChainAddress;
}
const TransactionList: FunctionComponent<TransactionListProps> = ({ chainAddress }) => {
  const erc20Contracts = useErc20Contracts({ chainAddress });

  const historicalBalances = useAlchemyStore((state) => state.historicalBalances);
  const balanceHistory =
    historicalBalances.filter((hb) => chainAddressEquals(hb.chainAddress, chainAddress)) ?? [];

  const txnLists = useEtherscanStore((state) => state.txnLists);
  const txns =
    txnLists.find((tl) => chainAddressEquals(tl.chainAddress, chainAddress))?.txnList ?? [];

  const { rows, columns } = useDataGridRC(chainAddress, erc20Contracts, txns, balanceHistory);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h6">Transactions List</Typography>
      <Box sx={{ height: 400, width: 900 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            sorting: {
              sortModel: [{ field: 'blockNumber', sort: 'desc' }],
            },
          }}
          pageSizeOptions={[5, 10]}
          rowSelection={false}
        />
      </Box>
    </Box>
  );
};
export default TransactionList;
