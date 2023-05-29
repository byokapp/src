import { ApexOptions } from 'apexcharts';
import { FunctionComponent } from 'preact';
import moment from 'moment';
import ReactApexChart from 'react-apexcharts';

import { DATETIME_FORMAT } from '@/constants';
import { commifyNumberString } from '@/logic';
import { ChartPoint } from '@/types';

// chart options
const areaChartOptions: ApexOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'stepline',
    width: 1.5,
  },
  grid: {
    strokeDashArray: 4,
  },
  title: {
    text: '<placeholder>',
    align: 'left',
  },
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       shadeIntensity: 1,
  //       inverseColors: false,
  //       opacityFrom: 0.5,
  //       opacityTo: 0,
  //       stops: [0, 90, 100],
  //     },
  //   },
  xaxis: {
    type: 'datetime',
    // categories: [],
    // labels: {
    //   format: 'MMM',
    // },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return commifyNumberString(val.toString(), 2) ?? '-';
      },
    },
  },
  tooltip: {
    x: {
      formatter: function (val: number) {
        return moment(val).local().format(DATETIME_FORMAT);
      },
    },
  },
};

interface LineChartProps {
  data: ChartPoint[];
  title: string;
  height?: number;
  width?: number;
  yAxisOnLeft?: boolean;
}
const LineChart: FunctionComponent<LineChartProps> = ({
  data,
  height,
  width,
  title,
  yAxisOnLeft,
}: LineChartProps) => {
  const placeholder = [
    { x: Number(moment().startOf('year').toDate()), y: 0 },
    { x: Date.now(), y: 0 },
  ];
  const xy = data.length === 0 ? placeholder : data;
  const categories = xy.map((d) => moment(d.x).local().format(DATETIME_FORMAT));
  const seriesName = title.toLocaleLowerCase();
  const options = {
    ...areaChartOptions,
    title: { ...areaChartOptions.title, text: title },
    xaxis: { ...areaChartOptions.xaxis, categories },
    yaxis: { ...areaChartOptions.yaxis, ...(!yAxisOnLeft ? { opposite: true, seriesName } : {}) },
  };
  const series = [{ name: seriesName, data: xy.map((d) => d.y) }];

  return (
    <ReactApexChart options={options} series={series} height={height ?? 245} width={width ?? 380} />
  );
};
export default LineChart;
