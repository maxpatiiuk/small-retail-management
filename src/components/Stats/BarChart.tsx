import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useTransitionDuration } from '../Hooks/useTransitionDuration';
import { RA, writable } from '../../lib/types';
import { f } from '../../lib/functools';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
);

export type DataSet = { readonly label: string; readonly data: RA<number> };

// Month: One chart. Group per employee. 3 columns per group

// Year. Two tabs:
// See all data for one month at a time - 12 charts. e groups. 3 columns
// See all data for one employee at a time - e charts. 12 groups. 3 columns

// All years. Two tabs:
// See all data for one year at a time - y charts. e groups. 3 columns
// See all data for one employee at a time - e charts. y groups 3 columns

export function BarChart({
  title,
  labels,
  dataSets,
}: {
  readonly title: string;
  readonly labels: RA<string>;
  readonly dataSets: RA<DataSet>;
}): JSX.Element | null {
  const transitionDuration = useTransitionDuration();

  const datasets = React.useMemo(
    () =>
      dataSets.map((data, index) => ({
        ...data,
        backgroundColor: `hsl(${indexToHue(index, dataSets.length)},100%,83%)`,
        borderColor: `hsl(${indexToHue(index, dataSets.length)},100%,69%)`,
        borderWidth: 2,
      })),
    [dataSets],
  );

  const yMin = React.useMemo(
    () => f.min(...dataSets.flat().map(({ data }) => f.min(...data) ?? 0)) ?? 0,
    [dataSets],
  );

  return (
    <Bar
      data={{
        labels: writable(labels),
        datasets,
      }}
      datasetIdKey="id"
      options={{
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
          },
        },
        responsive: true,
        animation: {
          duration: transitionDuration,
        },
        scales: {
          y: {
            min: yMin >= 0 ? 0 : undefined,
          },
        },
      }}
    />
  );
}

const indexToHue = (index: number, count: number): number =>
  ((count - ((index + 2) % count)) * 360) / count;
