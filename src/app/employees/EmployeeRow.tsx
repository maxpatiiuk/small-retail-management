import { Button } from '../../components/Atoms/Button';
import { Input } from '../../components/Atoms/Input';
import { Table } from '../../components/Atoms/Table';
import { localization } from '../../const/localization';
import { Employee } from './types';

export function EmployeeRow({
  employee,
  onChange: handleChange,
  onOrderUp: handleOrderUp,
  onOrderDown: handleOrderDown,
}: {
  readonly employee: Employee;
  readonly onChange: (employee: Employee | undefined) => void;
  readonly onOrderUp: (() => void) | undefined;
  readonly onOrderDown: (() => void) | undefined;
}): JSX.Element {
  return (
    <Table.Row>
      <Table.Cell>
        <Button.Icon
          onClick={handleOrderUp}
          title={localization.moveUp}
          icon="chevronUp"
        />
        <Button.Icon
          onClick={handleOrderDown}
          title={localization.moveDown}
          icon="chevronDown"
        />
      </Table.Cell>
      <Table.Cell>
        <Input.Text
          aria-label={localization.name}
          value={employee.name}
          onValueChange={(name): void => handleChange({ ...employee, name })}
          required
        />
      </Table.Cell>
      <Table.Cell>
        <Input.Number
          aria-label={localization.incomeShare}
          value={employee.incomeShare ?? ''}
          onValueChange={(incomeShare): void =>
            handleChange({ ...employee, incomeShare })
          }
          min={0}
          max={100}
        />
      </Table.Cell>
      <Table.Cell>
        <Input.Number
          aria-label={localization.baseSalary}
          value={employee.baseSalary ?? ''}
          onValueChange={(baseSalary): void =>
            handleChange({ ...employee, baseSalary })
          }
          min={0}
          step={1}
        />
      </Table.Cell>
      <Table.Cell>
        <Input.Checkbox
          aria-label={localization.isActive}
          checked={employee.isActive}
          onValueChange={(isActive): void =>
            handleChange({ ...employee, isActive })
          }
        />
        {process.env.NODE_ENV === 'development' && (
          <Button.Danger onClick={(): void => handleChange(undefined)}>
            {localization.delete}
          </Button.Danger>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
