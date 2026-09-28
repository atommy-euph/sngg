// Calendar days, not elapsed 24-hour periods: stable across local DST changes.
export const DAY_MS = 86400000;
export const EPOCH_DAY = Date.UTC(2022, 1, 16) / DAY_MS;
export const toDayNumber = (value: string): number => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('日付はYYYY-MM-DDで指定してください');
  const day = Date.parse(value + 'T00:00:00Z') / DAY_MS;
  if (!Number.isFinite(day) || toDateString(day) !== value) throw new Error('存在しない日付です');
  return day;
};
export const toDateString = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);
export const localDateString = (now: Date): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
