import type { UtcDate } from '../../lib/UtcDate';

export type Entry = {
  readonly id?: string;
  readonly employeeId: string;
  readonly revenue: number;
  readonly expenses: number;
  readonly date: UtcDate;
};
