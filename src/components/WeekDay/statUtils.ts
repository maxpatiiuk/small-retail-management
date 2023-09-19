import { Employee } from '../../app/employees/types';
import { Entry } from './types';

export const computeSalary = (
  employee: Employee,
  entry: Pick<Entry, 'revenue'>,
): number => (entry.revenue ?? 0) * (employee.incomeShare / 100);
