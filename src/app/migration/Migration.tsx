/**
 * A script for migrating from the MySQL database schema to the new Firestore
 * schema
 */

import { Button } from '../../components/Atoms/Button';
import { HOUR, MINUTE, SECOND } from '../../components/Atoms/timeUnits';
import { reconcileRecords } from '../../components/Hooks/useRecords';
import { syncAggregates } from '../../components/WeekDay/syncAggregates';
import { Entry } from '../../components/WeekDay/types';
import { localization } from '../../const/localization';
import { RA } from '../../lib/types';
import { UtcDate } from '../../lib/UtcDate';
import { employeeIdMapping, migrationData } from './data';
import React from 'react';

const timeZoneOffset = new Date().getTimezoneOffset() * MINUTE;

const process = (rawData: string): RA<Entry> =>
  rawData
    .trim()
    .split('\n')
    .map((row) =>
      row
        .split(',')
        .map((cell) => cell.slice(1, -1))
        .slice(1),
    )
    .map(([id, revenue, expenses, date]) => ({
      employeeId: employeeIdMapping[id as keyof typeof employeeIdMapping],
      revenue: Number.parseFloat(revenue),
      expenses: Number.parseFloat(expenses),
      date: UtcDate.fromTimestamp(
        Number.parseInt(date) * SECOND + timeZoneOffset + 3 * HOUR,
        false,
      ),
    }));

export function Migration(): JSX.Element {
  return (
    <Button.Danger
      onClick={(): void =>
        void reconcileRecords(process(migrationData), [], 'entries')
          .then((deltas) => {
            console.log(deltas);
            return syncAggregates(deltas);
          })
          .catch(console.error)
          .finally(() => console.log('COMPLETE'))
      }
    >
      {localization.save}
    </Button.Danger>
  );
}
