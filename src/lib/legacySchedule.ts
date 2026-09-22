import { LegacyRevision } from './scheduleTypes';

/** 移行前の固定順だけを扱う。新方式の乱数・巡回計算とは独立させる。 */
export function legacyStateAt(revision: LegacyRevision, day: number, start: number) {
  const order = revision.order;
  if (!order.length) throw new Error('出題予定が空です');
  // 初回適用日を再設定する管理処理では、旧順序が一巡した場合も再現する。
  const elapsed = day - start;
  const rounds = Math.floor(elapsed / order.length);
  const index = elapsed % order.length;
  const seen = rounds ? [] : revision.seen;
  return {
    referenceDate: revision.referenceDate, solution: order[index],
    cycle: revision.cycle + rounds, fullShuffle: revision.fullShuffle,
    seen: seen.concat(order.slice(0, index)), order, index, active: revision.active,
    // 旧方式には再利用可能なシードがない。初回移行時はreviseで新しく生成する。
    recipe: { candidates: undefined, seed: undefined, previous: undefined, skip: index },
  };
}
