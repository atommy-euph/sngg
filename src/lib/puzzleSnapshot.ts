import { resolveDay, Schedule } from './schedule';
import { localDateString, toDayNumber, toDateString, EPOCH_DAY } from './scheduleDates';

/** 指定日時の問題と駅データを一緒に解決する。端末の時計はこの関数内で読み直さない。 */
export function createPuzzleSnapshot(schedule: Schedule, now: Date) {
  const date = localDateString(now);
  const dayNumber = toDayNumber(date);
  const current = resolveDay(schedule, date);
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    ...current,
    solution_yesterday: resolveDay(schedule, toDateString(dayNumber - 1)).solution,
    puzzleNumber: dayNumber - EPOCH_DAY,
    tomorrow: next.getTime() - now.getTime(),
  };
}
