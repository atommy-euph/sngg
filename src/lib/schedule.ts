// Calendar days, not elapsed 24-hour periods: stable across local DST changes.
export const DAY_MS = 86400000;
export const epoch = Date.UTC(2022, 1, 16) / DAY_MS;
export const dateDay = (value: string): number => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('日付はYYYY-MM-DDで指定してください');
  const day = Date.parse(value + 'T00:00:00Z') / DAY_MS;
  if (!Number.isFinite(day) || dayDate(day) !== value) throw new Error('存在しない日付です');
  return day;
};
export const dayDate = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);
export const localDate = (now: Date): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

export type StationData = { [name: string]: { url: string; title: string }[] };
export interface Revision {
  referenceDate: string;
  effective: string;
  cycle: number;
  fullShuffle: string;
  seen: string[];
  // Only pre-migration history uses a literal order. New schedules store recipes.
  order?: string[];
  candidates?: string[];
  seed?: string;
  previous?: string;
  skip?: number;
  active: StationData;
  legacy?: boolean;
}
export interface Schedule {
  version: number;
  revisions: Revision[];
}

export function shuffled(names: string[], seed: string, previous?: string): string[] {
  const result = names.slice().sort();
  let state = 2166136261;
  for (let i = 0; i < seed.length; i++) state = Math.imul(state ^ seed.charCodeAt(i), 16777619) >>> 0;
  const random = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  // One station cannot satisfy the boundary rule; reject such configurations.
  if (result.length > 1 && result[0] === previous) [result[0], result[1]] = [result[1], result[0]];
  return result;
}

export function stateAt(schedule: Schedule, date: string) {
  const day = dateDay(date);
  const revision = schedule.revisions.filter(r => dateDay(r.effective) <= day).pop();
  if (!revision) throw new Error('出題設定の開始日より前です');
  let start = dateDay(revision.effective);
  let candidates = revision.candidates;
  let seed = revision.seed;
  let previous = revision.previous;
  let skip = revision.skip || 0;
  if (!revision.legacy && (!candidates || seed === undefined)) throw new Error('シャッフル設定がありません');
  let order = revision.legacy ? revision.order! : shuffled(candidates!, seed!, previous).slice(skip);
  let cycle = revision.cycle;
  let seen = revision.seen;
  let fullShuffle = revision.fullShuffle;
  while (day >= start + order.length) {
    if (order.length === 0) throw new Error('出題予定が空です');
    start += order.length;
    cycle++;
    previous = order[order.length - 1];
    candidates = Object.keys(revision.active).sort();
    seed = `tetsudoru-v1:cycle:${cycle}`;
    skip = 0;
    order = revision.legacy ? revision.order! : shuffled(candidates, seed, previous);
    seen = [];
    if (!revision.legacy) fullShuffle = dayDate(start);
  }
  const index = day - start;
  return { referenceDate: revision.referenceDate, solution: order[index], cycle, fullShuffle, seen: seen.concat(order.slice(0, index)), order, index, active: revision.active,
    recipe: { candidates, seed, previous, skip: skip + index } };
}

export function revise(schedule: Schedule, active: StationData, effective: string, initialize = false): Revision {
  if (Object.keys(active).length < 2) throw new Error('巡回境界の連続を防ぐため、2駅以上が必要です');
  const day = dateDay(effective);
  const before = stateAt(schedule, dayDate(day - 1));
  const today = stateAt(schedule, effective);
  const added = Object.keys(active).filter(name => !before.active[name]);
  // Reopened names count as new entries, even if present in this cycle's history.
  let seen = today.seen.filter(name => !added.includes(name));
  let cycle = today.cycle;
  let fullShuffle = today.fullShuffle;
  let remaining = Object.keys(active).filter(name => !seen.includes(name));
  if (!remaining.length) {
    seen = [];
    cycle = before.cycle + 1;
    fullShuffle = effective;
    remaining = Object.keys(active);
  }
  const full = fullShuffle === effective && seen.length === 0;
  const seed = full ? `tetsudoru-v1:cycle:${cycle}` : `tetsudoru-v1:revision:${schedule.revisions.length}:${effective}`;
  return {
    effective, cycle, referenceDate: before.referenceDate,
    fullShuffle: initialize ? before.fullShuffle : fullShuffle,
    seen: seen.slice().sort(), candidates: remaining.slice().sort(), seed, previous: before.solution, active,
  };
}
