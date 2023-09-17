import React from 'react';
import { RA } from '../lib/types';
import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firestore';
import { Employee } from './type';
import { LoadingBar } from '../Molecules/Loading';
import { useRecords } from '../Hooks/useRecords';

export function EmployeesProvider({
  children,
}: {
  readonly children: React.ReactNode;
}): React.ReactNode {
  const [employees, setEmployees] = useRecords<Employee>(
    React.useMemo(
      () => query(collection(db, 'employees'), orderBy('name')),
      [],
    ),
  );

  return employees === undefined ? (
    <LoadingBar />
  ) : (
    <EmployeesContext.Provider value={employees}>
      <EmployeesSaveContext.Provider value={setEmployees}>
        {children}
      </EmployeesSaveContext.Provider>
    </EmployeesContext.Provider>
  );
}

export const EmployeesContext = React.createContext<RA<Employee>>([]);
EmployeesContext.displayName = 'EmployeesContext';

export const EmployeesSaveContext = React.createContext<
  (employees: RA<Employee>) => Promise<void>
>(async () => console.error('Not defined'));