/**
 * Firestore does not have SUM/GROUP BY functionality.
 *
 * This function implements the recommended workaround:
 * keep track of a sum in a separate field and update it on any changes
 */

import { RA } from '../../lib/types';
import { Changelog } from '../Hooks/useRecords';
import { WeekDay } from './ColumnsContent';
import { Entry } from './types';

export async function syncAggregates(
  weekDays: RA<WeekDay>,
  changelog: Changelog<Entry>,
) {}
