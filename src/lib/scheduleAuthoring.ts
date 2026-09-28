import { Schedule, ShuffleRevision, StationData } from './scheduleTypes';
import { resolveScheduleState } from './schedule';
import { toDayNumber, toDateString } from './scheduleDates';

export function createRevision(schedule: Schedule, active: StationData, effective: string, initialize = false): ShuffleRevision {
  if (Object.keys(active).length < 2) throw new Error('巡回境界の連続を防ぐため、2駅以上が必要です');
  const day = toDayNumber(effective);
  const before = resolveScheduleState(schedule, toDateString(day - 1));
  const today = resolveScheduleState(schedule, effective);
  const added = Object.keys(active).filter(name => !before.active[name]);
  const removed = Object.keys(before.active).filter(name => !active[name]);
  // 駅集合が同じなら元のレシピと消化位置を保ち、リンク・基準日だけを更新する。
  if (!initialize && !added.length && !removed.length) {
    const { candidates, seed, previous, skip } = today.recipe;
    if (candidates === undefined || seed === undefined) throw new Error('旧方式からの移行には初回設定が必要です');
    return {
      effective, referenceDate: today.referenceDate, cycle: today.cycle,
      fullShuffle: today.fullShuffle, seen: today.seen.slice().sort(),
      candidates, seed, previous, skip, active,
    };
  }
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
