import React from 'react';
import { DAY, MINUTE } from '../Atoms/timeUnits';
import { UtcDate } from '../../lib/UtcDate';

export function useToday(): UtcDate {
  const [date, setDate] = React.useState(getMidnightToday);

  React.useEffect(() => {
    const now = UtcDate.fromNow();
    const updateToday = () => setDate(getMidnightToday);
    const offset = new Date().getTimezoneOffset() * MINUTE;
    const millisecondsTillNextDay = DAY - ((now.unixTimestamp - offset) % DAY);

    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      updateToday();
      interval = setInterval(updateToday, DAY);
    }, millisecondsTillNextDay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
  return date;
}

const getMidnightToday = (): UtcDate => UtcDate.fromNow();
