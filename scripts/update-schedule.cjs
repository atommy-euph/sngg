require('./load-typescript.cjs');
const fs = require('fs');
const { readSchedule } = require('../src/lib/scheduleValidation.ts');
const path = require('path');
const { resolveDay } = require('../src/lib/schedule.ts');
const { toDayNumber, localDateString, toDateString } = require('../src/lib/scheduleDates.ts');
const { createRevision } = require('../src/lib/scheduleAuthoring.ts');
// 編集用の正本から、適用日付きの生成物schedule.jsonを作る。
const { STATION_DATA: active } = require('../src/constants/station_names_5_katakana.ts');
const target = path.join(__dirname, '../src/constants/schedule.json');
const args = process.argv.slice(2);
const effective = args.find(x => /^\d{4}-\d{2}-\d{2}$/.test(x));
const initialize = args.includes('--init');
const today = localDateString(new Date());
try {
  if (!effective) throw new Error('使用方法: npm run schedule:update -- YYYY-MM-DD [--init] [--replace-pending]');
  toDayNumber(effective);
  if (effective <= today) throw new Error('適用日は実行日の翌日以降にしてください');
  if (Object.keys(active).length < 2) throw new Error('2駅以上が必要です');
  for (const [name, links] of Object.entries(active)) {
    if (name.length !== 5 || !Array.isArray(links) || !links.length || links.some(x => !x.url || !x.title)) throw new Error(`駅データを確認してください: ${name}`);
  }
  let config;
  if (fs.existsSync(target)) config = readSchedule(JSON.parse(fs.readFileSync(target, 'utf8')));
  else throw new Error('初期設定ファイルがありません');
  restoreLegacyOrderForMigration(config, initialize && args.includes('--replace-pending'));
  const oldReferenceDate = resolveDay(config, toDateString(toDayNumber(effective) - 1)).referenceDate;
  const canonical = data => JSON.stringify(Object.keys(data).sort().map(k => [k, data[k]]));
  let last = config.revisions[config.revisions.length - 1];
  const identical = last.effective === effective && canonical(last.active) === canonical(active) && !last.legacy;
  if (!identical) {
    if (last.effective > today) {
      if (!args.includes('--replace-pending')) throw new Error('未適用の設定があります。公開前の予定を置き換える場合は --replace-pending を指定してください');
      config.revisions.pop();
      last = config.revisions[config.revisions.length - 1];
    }
    if (effective <= last.effective) throw new Error('履歴より後の適用日が必要です');
    if (initialize !== !!last.legacy) throw new Error(last.legacy ? '初回は --init を指定してください' : '--init は初回だけ指定できます');
    const before = resolveDay(config, toDateString(toDayNumber(effective) - 1));
    const added = Object.keys(active).filter(k => !before.active[k]);
    const removed = Object.keys(before.active).filter(k => !active[k]);
    config.revisions.push(createRevision(config, active, effective, initialize));
    console.log('追加:', added.join('、') || 'なし');
    console.log('削除:', removed.join('、') || 'なし');
  } else console.log('同じ設定です。出題順は維持します。');
  console.log('駅名・読みの基準日:', oldReferenceDate, '→', today, '（適用日から表示）');
  config.revisions[config.revisions.length - 1].referenceDate = today;
  trimLegacyHistory(config);
  for (const revision of config.revisions) {
    revision.active = Object.fromEntries(Object.keys(revision.active).sort().map(name => [name, revision.active[name]]));
  }
  const result = resolveDay(config, effective);
  console.log('適用日:', effective, '残り:', result.order.length - result.index);
  console.log('次の巡回:', toDateString(toDayNumber(effective) + result.order.length - result.index));
  fs.writeFileSync(target + '.tmp', JSON.stringify(config, null, 2) + '\n');
  fs.renameSync(target + '.tmp', target);
  console.log('出題設定を保存しました。駅データと一緒にコミット・デプロイしてください。');
} catch (error) { console.error(error.message); process.exitCode = 1; }

/** 公開前の初回適用日を変更するときだけ、管理用の旧順序を復元する。 */
function restoreLegacyOrderForMigration(config, replacingInitialMigration) {
  if (!replacingInitialMigration) return;
  const legacyFile = path.join(__dirname, 'legacy-order.json');
  config.revisions[0].order = JSON.parse(fs.readFileSync(legacyFile, 'utf8'));
}

/** ブラウザへ渡す旧順序を、初回移行前に選ばれる日数分だけに限定する。 */
function trimLegacyHistory(config) {
  const migration = config.revisions.find(r => !r.legacy);
  if (!migration) return;
  const legacy = config.revisions[0];
  legacy.order = legacy.order.slice(0, toDayNumber(migration.effective) - toDayNumber(legacy.effective));
}
