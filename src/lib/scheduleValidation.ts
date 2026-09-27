import { Schedule } from './scheduleTypes';
import { toDayNumber } from './scheduleDates';

/** 生成物の構造を検証してから、ブラウザと管理CLIで共通利用する。 */
export function readSchedule(value: unknown): Schedule {
  requireValid(isObject(value), '設定はオブジェクトが必要です');
  const config = value as Record<string, unknown>;
  requireValid(Array.isArray(config.revisions) && config.revisions.length > 0, 'revisionsは空でない配列が必要です');
  let lastEffective = -Infinity;
  const revisions = config.revisions as unknown[];
  for (let index = 0; index < revisions.length; index++) {
    const entry = revisions[index];
    const label = 'revisions[' + index + ']';
    requireValid(isObject(entry), label + 'はオブジェクトが必要です');
    const revision = entry as Record<string, unknown>;
    for (const field of ['effective', 'referenceDate', 'fullShuffle']) {
      requireValid(typeof revision[field] === 'string', label + '.' + field + 'は日付文字列が必要です');
      try { toDayNumber(revision[field] as string); } catch { throw new Error(label + '.' + field + 'の日付が不正です'); }
    }
    const effective = toDayNumber(revision.effective as string);
    requireValid(effective > lastEffective, '改訂の適用日は重複のない昇順が必要です');
    lastEffective = effective;
    requireValid(Number.isInteger(revision.cycle) && (revision.cycle as number) > 0, label + '.cycleは正の整数が必要です');
    requireNames(revision.seen, label + '.seen', true);
    requireValid(isObject(revision.active) && Object.keys(revision.active as object).length >= 2, label + '.activeは2駅以上が必要です');
    for (const [name, links] of Object.entries(revision.active as Record<string, unknown>)) {
      requireValid(name.length > 0 && Array.isArray(links) && links.length > 0, label + '.activeの駅データが不正です');
      for (const link of links as unknown[]) {
        requireValid(isObject(link) && typeof link.title === 'string' && link.title.length > 0 && typeof link.url === 'string' && link.url.length > 0,
          label + '.activeのリンクが不正です: ' + name);
      }
    }
    if (revision.legacy === true) {
      requireValid(index === 0, '旧方式の改訂は先頭だけに指定できます');
      requireNames(revision.order, label + '.order');
    } else {
      requireValid(revision.legacy === undefined || revision.legacy === false, label + '.legacyは真偽値が必要です');
      requireNames(revision.candidates, label + '.candidates');
      requireValid(typeof revision.seed === 'string' && revision.seed.length > 0, label + '.seedは空でない文字列が必要です');
      requireValid(revision.previous === undefined || typeof revision.previous === 'string', label + '.previousは文字列が必要です');
      const consumed = revision.skip === undefined ? 0 : revision.skip;
      requireValid(Number.isInteger(consumed) && (consumed as number) >= 0 && (consumed as number) < (revision.candidates as unknown[]).length,
        label + '.skipは候補数未満の非負整数が必要です');
    }
  }
  return value as Schedule;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireValid(condition: boolean, message: string): void {
  if (!condition) throw new Error('出題設定が不正です: ' + message);
}

function requireNames(value: unknown, label: string, allowEmpty = false): void {
  requireValid(Array.isArray(value) && (allowEmpty || value.length > 0) &&
    value.every(name => typeof name === 'string' && name.length > 0) && new Set(value).size === value.length,
    label + 'は重複のない駅名配列が必要です');
}
