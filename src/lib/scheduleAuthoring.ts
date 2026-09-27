import { Schedule, ShuffleRevision, StationData } from './scheduleTypes';
import { resolveDay } from './schedule';
import { toDayNumber, toDateString } from './scheduleDates';

export function createRevision(schedule: Schedule, active: StationData, effective: string, initialize = false): ShuffleRevision {
  if (Object.keys(active).length < 2) throw new Error('巡回境界の連続を防ぐため、2駅以上が必要です');
  const day = toDayNumber(effective);
  const before = resolveDay(schedule, toDateString(day - 1));
  const today = resolveDay(schedule, effective);
  const added = Object.keys(active).filter(name => !before.active[name]);
  // Reopened names count as new entries, even if present in this cycle's history.
  let seen = today.seen.filter(name => !added.includes(name));
  let cycle = today.cycle;
  let fullShuffleDate = today.fullShuffle;
  let remaining = Object.keys(active).filter(name => !seen.includes(name));
  if (!remaining.length) {
    seen = [];
    cycle = before.cycle + 1;
    fullShuffleDate = effective;
    remaining = Object.keys(active);
  }
  const full = fullShuffleDate === effective && seen.length === 0;
  // 全体の巡回は巡回番号、未出題分の更新は履歴件数と適用日でシードを固定する。
  const seed = full ? `tetsudoru-v1:cycle:${cycle}` : `tetsudoru-v1:revision:${schedule.revisions.length}:${effective}`;
  return {
    effective, cycle, referenceDate: before.referenceDate,
    fullShuffle: initialize ? before.fullShuffle : fullShuffleDate,
    seen: seen.slice().sort(), candidates: remaining.slice().sort(), seed, previous: before.solution, active,
  };
}
