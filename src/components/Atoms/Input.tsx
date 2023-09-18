import React from 'react';
import { f } from '../../lib/functools';
import { className } from './className';
import { wrap } from './wrap';
import { useLiveState } from '../Hooks/useLiveState';
import { dateUtils } from '../../lib/dateUtils';
import { useBooleanState } from '../Hooks/useBooleanState';
import { formatCurrency } from './Internationalization';

const InputGeneric = wrap<
  'input',
  {
    readonly onValueChange?: (value: string) => void;
    readonly children?: undefined;
  }
>(
  'Input.Generic',
  'input',
  `${className.input} w-full`,
  ({ onValueChange, ...props }) => ({
    ...props,
    onChange(event): void {
      onValueChange?.((event.target as HTMLInputElement).value);
      props.onChange?.(event);
    },
  }),
);

/**
 * Safari does not support input[type=week], but claims to support it
 * (even fools modernizr.com).
 * See https://codepen.io/maxpatiiuk/pen/WNLZORj?editors=1010
 * So have no choice but to use user agent.
 */
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const inputWeekSupported = !isSafari;

const createDateInput = (
  type: 'date' | 'week' | 'month' | 'number',
  format: (date: Date) => string,
  parse: (rawDate: string) => Date | undefined,
) =>
  function ({
    date,
    onDateChange: handleDateChange,
    ...props
  }: Omit<
    Parameters<typeof InputGeneric>[0],
    'type' | 'onValueChange' | 'value'
  > & {
    readonly date: Date;
    readonly onDateChange: (date: Date) => void;
  }): JSX.Element {
    const [pendingDate, setPendingDate] = useLiveState(
      React.useCallback(() => f.maybe(date, format), [date]),
    );
    return (
      <InputGeneric
        value={pendingDate}
        onValueChange={(rawDate): void => {
          setPendingDate(rawDate);
          const date = parse(rawDate);
          if (date !== undefined) handleDateChange(date);
        }}
        onBlur={(): void => {
          if (pendingDate === undefined) setPendingDate(format(date));
        }}
        type={type}
        {...props}
      />
    );
  };
const InputDate = createDateInput(
  'date',
  dateUtils.date.format,
  dateUtils.date.parse,
);
const InputWeek = createDateInput(
  'week',
  dateUtils.week.format,
  dateUtils.week.parse,
);
const InputMonth = createDateInput(
  'month',
  dateUtils.month.format,
  dateUtils.month.parse,
);
const InputYear = createDateInput(
  'number',
  dateUtils.year.format,
  dateUtils.year.parse,
);

const InputNumber = wrap<
  'input',
  {
    readonly value: number | '';
    readonly onValueChange?: (value: number) => void;
    readonly type?: never;
    readonly children?: undefined;
  }
>(
  'Input.Number',
  'input',
  `${className.input} w-full`,
  ({ onValueChange: handleValueChange, ...props }) => ({
    ...props,
    type: 'number',
    onChange(event): void {
      handleValueChange?.(
        // This non-null assertion is unsafe, but simplifies typing
        f.parseFloat((event.target as HTMLInputElement).value)!,
      );
      props.onChange?.(event);
    },
  }),
);

const InputText = wrap<
  'input',
  {
    readonly onValueChange?: (value: string) => void;
    readonly type?: never;
    readonly children?: undefined;
  }
>(
  'Input.Text',
  'input',
  `${className.input} w-full`,
  ({ onValueChange: handleChange, ...props }) => ({
    ...props,
    type: 'text',
    onChange(event): void {
      handleChange?.((event.target as HTMLInputElement).value);
      props.onChange?.(event);
    },
  }),
);

export const Input = {
  Checkbox: wrap<
    'input',
    {
      readonly onValueChange?: (isChecked: boolean) => void;
      readonly type?: never;
      // This is used to forbid accidentally passing children
      readonly children?: undefined;
    }
  >(
    'Input.Checkbox',
    'input',
    `rounded-sm`,
    ({ onValueChange: handleValueChange, readOnly, ...props }) => ({
      ...props,
      type: 'checkbox',
      onChange(event): void {
        // Disable onChange when readOnly
        if (props.disabled === true || readOnly === true) return;
        handleValueChange?.((event.target as HTMLInputElement).checked);
        props.onChange?.(event);
      },
    }),
  ),
  Text: InputText,
  Number: InputNumber,
  Currency({
    value,
    onValueChange: handleValueChange,
    ...rest
  }: Parameters<typeof InputNumber>[0]): JSX.Element {
    const [isFocused, handleFocused, handleBlur] = useBooleanState();
    const formatted = React.useMemo(
      () => (typeof value === 'number' ? formatCurrency(value) : value),
      [value],
    );
    return isFocused ? (
      <InputNumber
        value={(value ?? 0) === 0 ? '' : value}
        onValueChange={handleValueChange}
        {...rest}
        onBlur={(event): void => {
          handleBlur();
          rest.onBlur?.(event);
        }}
        forwardRef={(element): void => element?.focus()}
      />
    ) : (
      <InputText
        value={value === 0 ? '' : formatted}
        onValueChange={() => console.error('Not supposed to be called')}
        {...rest}
        onFocus={(event): void => {
          handleFocused();
          rest.onFocus?.(event);
        }}
      />
    );
  },
  Generic: InputGeneric,
  Date: InputDate,
  Week: inputWeekSupported ? InputWeek : InputDate,
  Month: InputMonth,
  Year: InputYear,
};
