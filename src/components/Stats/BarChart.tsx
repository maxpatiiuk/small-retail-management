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

// TODO: format currency

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
    () => f.min(...dataSets.flat().map(({ data }) => f.min(...data))) ?? 0,
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
            font: {
              size: 20,
            },
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
