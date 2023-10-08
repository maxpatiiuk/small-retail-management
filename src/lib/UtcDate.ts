import { DAY, WEEK } from '../components/Atoms/timeUnits';

/**
 * A thin wrapper for native date that fixes several issues:
 * - forces all dates to have time set at midnight UTC-0
 * - uses getters/setters allowing for syntax like `date.date += 1;`
 * - makes months be 1-based
 * - makes names shorter, less ambiguous and more memorable
 */
export class UtcDate {
  private constructor(
    private _date: Date,
    strict = true,
  ) {
    const originalTimestamp = _date.getTime();
    this._date.setUTCHours(0, 0, 0, 0);
    if (strict && this._date.getTime() !== originalTimestamp)
      throw new Error(`Unexpected non-UTC midnight date: ${originalTimestamp}`);
  }

  public valueOf(): number {
    return this._date.valueOf();
  }
  public toString(): string {
    return this._date.toString();
  }
  public toJSON(): string {
    return this._date.toJSON();
  }
  public get unsafeDate(): Date {
    return new Date(this._date);
  }

  public static fromTimestamp(timestamp: number, strict?: boolean): UtcDate {
    return new UtcDate(new Date(timestamp), strict);
  }

  public static fromDate(year: number, month: number, day: number): UtcDate {
    return new UtcDate(new Date(Date.UTC(year, month - 1, day)));
  }

  public static fromNow(): UtcDate {
    return new UtcDate(new Date(), false);
  }

  public clone(): UtcDate {
    return UtcDate.fromTimestamp(this.unixTimestamp);
  }

  /** 0-6, starting with Sunday */
  public get dayOfWeek(): number {
    return this._date.getUTCDay();
  }
  public set dayOfWeek(dayOfWeek: number) {
    this.day += dayOfWeek - this.dayOfWeek;
  }

  public get day(): number {
    return this._date.getUTCDate();
  }
  public set day(date: number) {
    this._date.setUTCDate(date);
  }

  public get month(): number {
    return this._date.getUTCMonth() + 1;
  }
  public set month(month: number) {
    this._date.setUTCMonth(month - 1);
  }

  public get year(): number {
    return this._date.getUTCFullYear();
  }
  public set year(year: number) {
    this._date.setUTCFullYear(year);
  }

  public get unixTimestamp(): number {
    return this._date.getTime();
  }
  public set unixTimestamp(unixTimestamp: number) {
    this._date.setTime(unixTimestamp);
  }

  /**
   * Adapted from https://stackoverflow.com/a/6117889/8584605 and
   * https://weeknumber.com/how-to/javascript
   */
  public get week(): number {
    const date = this.clone();
    const daysInWeek = WEEK / DAY;
    // Make Sunday's day number 7
    const offset = date.dayOfWeek === 0 ? daysInWeek : 0;
    // Thursday in current week decides the year.
    date.dayOfWeek = 4 - offset;

    // Get first day of year
    const yearStart = UtcDate.fromDate(date.year, 1, 1);
    // Calculate full weeks to nearest Thursday
    return Math.ceil(
      ((date.unixTimestamp - yearStart.unixTimestamp) / DAY + 1) / daysInWeek,
    );
  }
  /** Adapted from https://stackoverflow.com/a/16591175/8584605 */
  public set week(week: number) {
    const daysInWeek = WEEK / DAY;
    this._date = new Date(Date.UTC(this.year, 0, 1 + (week - 1) * daysInWeek));

    // Get the Monday past, and add a week if the day was
    // Friday, Saturday or Sunday.
    this.day += 1 - this.dayOfWeek + (this.dayOfWeek > 4 ? daysInWeek : 0);
  }
}
