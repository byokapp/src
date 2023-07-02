import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { first, get, last, sift, sort } from 'radash';
import { Box, Divider, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

import LineChart from './LineChart';

import { CG_STATIC } from '@/constants';
import { chainAddressEquals, getStartAndEndTimestamps, getTimeWindowLabel } from '@/logic';
import { Asset, ChainAddress, TimeWindow } from '@/types';
import { responsiveChartsWidth } from '@/uiLogic';

import { useAlchemyStore } from '@/hooks/useAlchemy';
import { Price, useCoingeckoPricesStore } from '@/hooks/useCoinGeckoPrices';
import { useDataGridRC } from '@/hooks/useDataGridRC';
import { useEtherscanStore } from '@/hooks/useEtherscan';
import { useErc20Contracts } from '@/hooks/useErc20Contracts';
import { useTokensOnPlatform } from '@/hooks/useTokensOnPlatform';
import { usePersistentBalancesStore } from '@/stores/persistentBalancesState';
import { useBoundStore } from '@/stores/useBoundStore';

const TIME_WINDOWS = [
  TimeWindow.ONE_MONTH,
  TimeWindow.THREE_MONTHS,
  TimeWindow.YTD,
  TimeWindow.SIX_MONTHS,
  TimeWindow.ONE_YEAR,
  TimeWindow.TWO_YEARS,
];

interface TripleChartProps {
  chainAddress: ChainAddress;
}
const TripleChart: FunctionComponent<TripleChartProps> = ({ chainAddress }) => {
  const [timeWindow, setTimeWindow, activeAsset, setActiveAsset] = useBoundStore((state) => [
    state.timeWindow,
    state.setTimeWindow,
    state.activeAsset,
    state.setActiveAsset,
  ]);
  const { tokens: CGTokenPrices, refresh } = useCoingeckoPricesStore();
  const erc20Contracts = useErc20Contracts({ chainAddress });
  const tokensOnPlatform = useTokensOnPlatform();

  const { chain } = chainAddress;

  const handleChangeTimeWindow = (
    event: React.MouseEvent<HTMLElement>,
    newTimeWindow: TimeWindow,
  ) => setTimeWindow(newTimeWindow);

  const handleChangeActiveAsset = (event: React.MouseEvent<HTMLElement>, newActiveAsset: Asset) =>
    setActiveAsset(newActiveAsset);

  useEffect(() => {
    refresh(activeAsset.id);
  }, [activeAsset]);

  const allAssets: Asset[] = [
    { id: CG_STATIC[chain].nativeAssetId, details: CG_STATIC[chain] },
    ...erc20Contracts.map((erc20Contract) => ({
      details: erc20Contract,
      id:
        tokensOnPlatform.get([CG_STATIC[chain].platform, erc20Contract.address].join(':')) ??
        '<unknown>',
    })),
  ];

  const historicalBalances = useAlchemyStore((state) => state.historicalBalances);
  const balances = usePersistentBalancesStore((state) => state.balances);
  const currentBalance = balances.find((balance) =>
    chainAddressEquals(balance.chainAddress, chainAddress),
  );
  const balanceHistory =
    historicalBalances.filter((hb) => chainAddressEquals(hb.chainAddress, chainAddress)) ?? [];

  const txnLists = useEtherscanStore((state) => state.txnLists);
  const txns =
    txnLists.find((tl) => chainAddressEquals(tl.chainAddress, chainAddress))?.txnList ?? [];

  const { rows } = useDataGridRC(chainAddress, erc20Contracts, txns, balanceHistory);

  const [startTimestamp, endTimestamp] = getStartAndEndTimestamps(timeWindow);

  const assetBalancesChartIrregularStart = [
    ...sift(
      rows.map((r) => {
        const unitsStr = get(r, `${activeAsset.details.symbol}.props.unitsStr`) ?? undefined;
        const x = Number(r.unixTimestamp) * 1000;
        return unitsStr ? { x, y: Number(unitsStr) } : undefined;
      }),
    ),
  ];
  const firstDateSeen = first(assetBalancesChartIrregularStart)?.x;
  const lastChartPointBeforeStartTimestamp = last(
    sort(
      assetBalancesChartIrregularStart.filter((cp) => cp.x <= startTimestamp),
      (cp) => Number(cp.x),
    ),
  );
  const assetBalancesChart = sift([
    firstDateSeen && firstDateSeen > startTimestamp
      ? { x: startTimestamp, y: 0 }
      : lastChartPointBeforeStartTimestamp
      ? { ...lastChartPointBeforeStartTimestamp, x: startTimestamp }
      : undefined,
    ...assetBalancesChartIrregularStart.filter(
      (cp) => startTimestamp <= cp.x && cp.x <= endTimestamp,
    ),
  ]);

  const tokenPrices = CGTokenPrices.find((tp) => tp.id === activeAsset.id)?.prices ?? [];
  const assetPricesChart = tokenPrices
    .filter((tp) => startTimestamp <= tp[0] && tp[0] <= endTimestamp)
    .map((price: Price) => ({
      x: price[0],
      y: price[1],
    }));

  const reversedBalancesChart = assetBalancesChart.slice().reverse();
  const assetBalancesUsdChart = [
    ...assetPricesChart.map((p) => {
      const q = reversedBalancesChart.find((cp) => cp.x <= p.x);
      return { ...p, y: p.y * (q?.y ?? 0) };
    }),
  ];

  const width = responsiveChartsWidth();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        '& > *': {
          m: 1,
        },
        width,
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <ToggleButtonGroup
          size="small"
          value={timeWindow}
          exclusive
          onChange={handleChangeTimeWindow}
          aria-label="time window toggle button group"
        >
          {TIME_WINDOWS.map((tw) => (
            <ToggleButton value={tw}>{getTimeWindowLabel(tw)}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        divider={<Divider orientation="vertical" flexItem />}
        spacing={0.5}
      >
        <LineChart
          data={assetBalancesChart}
          title={`${activeAsset.details.symbol} Balance`}
          yAxisOnLeft={true}
        />
        <LineChart
          data={assetBalancesUsdChart}
          title={`USD Balance (${activeAsset.details.symbol})`}
        />
        <LineChart data={assetPricesChart} title={`${activeAsset.details.symbol} Spot Price`} />
      </Stack>

      <Box display="flex" justifyContent="flex-end">
        <ToggleButtonGroup
          size="small"
          value={allAssets}
          exclusive
          onChange={handleChangeActiveAsset}
          aria-label="active assets multiple select button group"
        >
          {allAssets.map((asset) => (
            <ToggleButton
              value={asset}
              selected={asset.id === activeAsset.id}
              sx={{ textTransform: 'unset' }}
            >
              {asset.details.symbol}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};
export default TripleChart;
