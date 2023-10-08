/**
 * Firestore does not have SUM/GROUP BY functionality.
 *
 * This function implements the recommended workaround:
 * keep track of a sum in a separate field and update it on any changes
 */

import { db } from '../../lib/firestore';
import { Changelog } from '../Hooks/useRecords';
import { Entry } from './types';
import { DocumentSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';

export const syncAggregates = async (
  changelog: Changelog<Entry>,
): Promise<void> => applyDeltas(computeDeltas(changelog));

type Deltas = Record<number, Record<number, Record<string, DeltaEntry>>>;
export type DeltaEntry = { revenue: number; expenses: number };

function computeDeltas(changelog: Changelog<Entry>): Deltas {
  const deltas: Deltas = {};

  const added = [
    ...changelog.added,
    ...changelog.updated.map((entry) => entry.new),
  ];
  added.forEach((entry) => apply(entry, entry.revenue, entry.expenses));

  const removed = [
    ...changelog.removed,
    ...changelog.updated.map((entry) => entry.old),
  ];
  removed.forEach((entry) => apply(entry, -entry.revenue, -entry.expenses));

  function apply(
    { date, employeeId }: Entry,
    revenue: number,
    expenses: number,
  ) {
    const year = date.year;
    const month = date.month;

    deltas[year] ??= {};
    deltas[year][month] ??= {};
    deltas[year][month][employeeId] ??= { revenue: 0, expenses: 0 };

    deltas[year][month][employeeId].revenue += revenue;
    deltas[year][month][employeeId].expenses += expenses;
  }

  return deltas;
}

async function applyDeltas(deltas: Deltas): Promise<void> {
  const promises = Object.entries(deltas).flatMap(([year, months]) => {
    const yearSums: Record<string, DeltaEntry> = {};

    const monthPromises = Object.entries(months).flatMap(
      ([month, employees]) => {
        return Object.entries(employees).map(
          async ([employeeId, { revenue, expenses }]) => {
            yearSums[employeeId] ??= { revenue: 0, expenses: 0 };
            yearSums[employeeId].revenue += revenue;
            yearSums[employeeId].expenses += expenses;

            const document = await fetchMonthStat(year, month, employeeId);
            const data = document.data() as DeltaEntry | undefined;

            await setDoc(document.ref, {
              revenue: (data?.revenue ?? 0) + revenue,
              expenses: (data?.expenses ?? 0) + expenses,
            });
          },
        );
      },
    );

    const yearPromises = Object.entries(yearSums).map(
      async ([employeeId, { revenue, expenses }]) => {
        const document = await fetchYearStat(year, employeeId);
        const data = document.data();

        await setDoc(document.ref, {
          revenue: (data?.revenue ?? 0) + revenue,
          expenses: (data?.expenses ?? 0) + expenses,
        });
      },
    );

    return [...monthPromises, ...yearPromises];
  });

  await Promise.all(promises).then(() => undefined);
}

async function fetchMonthStat(
  year: string,
  month: string,
  employeeId: string,
): Promise<DocumentSnapshot<DeltaEntry, DeltaEntry>> {
  const docRef = doc(
    db,
    'monthSums',
    year,
    'month',
    month,
    'employee',
    employeeId,
  );
  const document = await getDoc(docRef);
  return document as DocumentSnapshot<DeltaEntry, DeltaEntry>;
}

async function fetchYearStat(
  year: string,
  employeeId: string,
): Promise<DocumentSnapshot<DeltaEntry, DeltaEntry>> {
  const docRef = doc(db, 'yearSums', employeeId, 'year', year);
  const document = await getDoc(docRef);
  return document as DocumentSnapshot<DeltaEntry, DeltaEntry>;
}
