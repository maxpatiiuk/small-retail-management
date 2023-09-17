import React from 'react';
import { DAY, MINUTE } from '../Atoms/timeUnits';

export function useToday(): Date {
  const [date, setDate] = React.useState(getMidnightToday);

  React.useEffect(() => {
    const now = new Date();
    const updateToday = () => setDate(getMidnightToday);
    const offset = now.getTimezoneOffset() * MINUTE;
    const millisecondsTillNextDay = DAY - ((now.getTime() - offset) % DAY);

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

function getMidnightToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
