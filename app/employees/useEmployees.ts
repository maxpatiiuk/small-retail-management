import React from 'react';
import { useAsyncState } from '../Hooks/useAsyncState';
import { RA } from '../lib/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firestore';

type Employee = {
  readonly id?: number;
  readonly baseIncome: number;
  readonly isActive: boolean;
  readonly name: string;
  readonly revenueSharePercentage: number;
};

export function useEmployees(): {
  employees: RA<Employee> | undefined;
  setEmployees: (employees: RA<Employee>) => void;
  save: () => Promise<void>;
} {
  const [employees, setEmployees] = useAsyncState<RA<Employee>>(
    React.useCallback(
      () =>
        getDocs(collection(db, 'employees'))
          .then(console.log)
          .then(() => []),
      []
    ),
    true
  );

  return {
    employees,
    setEmployees,
    save: React.useCallback(async () => {}, []),
  };
}
