require('./load-typescript.cjs');
const fs = require('fs');
const path = require('path');
const { dateDay, dayDate, stateAt } = require('../src/lib/schedule.ts');

// Evaluate each date so pending station changes can shorten or extend the cycle.
function listSchedule(config, from) {
  const start = dateDay(from);
  const cycle = stateAt(config, from).cycle;
  const rows = [];
  for (let day = start; ; day++) {
    const date = dayDate(day);
    const state = stateAt(config, date);
    if (state.cycle !== cycle) break;
    rows.push({ date, station: state.solution });
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
    const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/constants/schedule.json'), 'utf8'));
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
