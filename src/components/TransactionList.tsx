import { FunctionComponent } from 'preact';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

import { chainAddressEquals } from '@/logic';
import { useAlchemyStore } from '@/hooks/useAlchemy';
import { useDataGridRC } from '@/hooks/useDataGridRC';
import { useErc20Contracts } from '@/hooks/useErc20Contracts';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { ChainAddress } from '@/types';
import { responsiveTableWidth } from '@/uiLogic';

const GridToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarExport />
  </GridToolbarContainer>
);

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

  const width = responsiveTableWidth();
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Typography variant="h6">Transactions List</Typography>
      <Box sx={{ height: 400, width }}>
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
