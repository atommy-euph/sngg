require('./load-typescript.cjs');
const { readSchedule } = require('../src/lib/scheduleValidation.ts');

function assertStationDataMatches(schedule, source) {
  const canonical = data => JSON.stringify(Object.keys(data).sort().map(name =>
    [name, data[name].map(({ title, url }) => [title, url])]));
  const latest = schedule.revisions[schedule.revisions.length - 1];
  if (canonical(latest.active) !== canonical(source)) {
    throw new Error('駅データと最新の出題設定が一致しません。npm run schedule:update -- YYYY-MM-DD を実行してください');
  }
}

if (require.main === module) {
  try {
    const schedule = readSchedule(require('../src/constants/schedule.json'));
    const { STATION_DATA } = require('../src/constants/station_names_5_katakana.ts');
    assertStationDataMatches(schedule, STATION_DATA);
    console.log('出題設定と駅データの一致を確認しました。');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { assertStationDataMatches };
