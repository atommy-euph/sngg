require('./load-typescript.cjs');
const fs = require('fs');
const { readSchedule } = require('../src/lib/scheduleValidation.ts');
const path = require('path');
const { resolveScheduleState } = require('../src/lib/schedule.ts');
const { toDayNumber, toDateString } = require('../src/lib/scheduleDates.ts');

// 巡回の残りを再利用するが、途中の改訂適用日では必ず再解決する。
function listSchedule(config, from) {
  let day = toDayNumber(from);
  const cycle = resolveScheduleState(config, from).cycle;
  const rows = [];
  while (true) {
    const state = resolveScheduleState(config, toDateString(day));
    if (state.cycle !== cycle) break;
    const nextRevision = config.revisions.find(r => toDayNumber(r.effective) > day);
    const untilRevision = nextRevision ? toDayNumber(nextRevision.effective) - day : Infinity;
    const count = Math.min(state.order.length - state.index, untilRevision);
    for (let offset = 0; offset < count; offset++) {
      rows.push({ date: toDateString(day + offset), station: state.order[state.index + offset] });
    }
    day += count;
  }
  return rows;
}

const csvCell = value => /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
function toCsv(rows) {
  return '出題日,出題駅\n' + rows.map(row => [row.date, row.station].map(csvCell).join(',')).join('\n') + '\n';
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 1 && !(args.length === 3 && args[1] === '--output')) {
      throw new Error('使用方法: npm run schedule:list -- YYYY-MM-DD [--output ファイル名.csv]');
    }
    const config = readSchedule(JSON.parse(fs.readFileSync(path.join(__dirname, '../src/constants/schedule.json'), 'utf8')));
    const rows = listSchedule(config, args[0]);
    const csv = toCsv(rows);
    if (args.length === 3) {
      // UTF-8 BOM for spreadsheet applications. Never overwrite an existing file.
      fs.writeFileSync(path.resolve(args[2]), '\uFEFF' + csv, { encoding: 'utf8', flag: 'wx' });
      console.error(`${rows.length}件（${rows[0].date}〜${rows[rows.length - 1].date}）を保存しました。`);
    } else process.stdout.write(csv);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { listSchedule, toCsv };
