import { Button } from '../../components/Atoms/Button';
import { Input } from '../../components/Atoms/Input';
import { Table } from '../../components/Atoms/Table';
import { localization } from '../../const/localization';
import { Employee } from './types';

export function Employee({
  employee,
  onChange: handleChange,
}: {
  readonly employee: Employee;
  readonly onChange: (employee: Employee | undefined) => void;
}): JSX.Element {
  return (
    <Table.Row>
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
          value={employee.revenueSharePercentage}
          onValueChange={(revenueSharePercentage = 0): void =>
            handleChange({ ...employee, revenueSharePercentage })
          }
          min={0}
          max={100}
        />
      </Table.Cell>
      <Table.Cell>
        <Input.Number
          aria-label={localization.baseSalary}
          value={employee.baseSalary}
          onValueChange={(baseSalary = 0): void =>
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
