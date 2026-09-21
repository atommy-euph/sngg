const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { listSchedule, toCsv } = require('./list-schedule.cjs');
const { stateAt, revise } = require('../src/lib/schedule.ts');
const config = require('../src/constants/schedule.json');

test('includes specified date, stops before next cycle, and crosses initial migration', () => {
  const rows = listSchedule(config, '2026-09-23');
  assert.equal(rows[0].date, '2026-09-23');
  assert.equal(rows.at(-1).date, '2029-08-05');
  assert.equal(rows.length, 1048);
  for (const row of rows) assert.equal(row.station, stateAt(config, row.date).solution);
  assert.equal(listSchedule(config, '2029-08-05').length, 1);
  assert.equal(listSchedule(config, '2029-08-06').length, 1350);
});

test('pending changes extend or shorten the cycle', () => {
  const data = names => Object.fromEntries(names.map(n => [n, [{title:n,url:'https://example.com'}]]));
  const fixture = () => ({version:3,revisions:[{effective:'2026-01-01',referenceDate:'2026-01-01',cycle:1,fullShuffle:'2026-01-01',seen:[],candidates:['A','B','C','D','E'],seed:'14',active:data(['A','B','C','D','E'])}]});
  const extended = fixture();
  extended.revisions.push(revise(extended,data(['A','B','C','D','E','X']),'2026-01-03'));
  assert.equal(listSchedule(extended,'2026-01-02').at(-1).date,'2026-01-06');
  const shortened = fixture();
  shortened.revisions.push(revise(shortened,data(['A','B']),'2026-01-03'));
  assert.deepEqual(listSchedule(shortened,'2026-01-02'),[{date:'2026-01-02',station:'B'}]);
});

test('invalid dates fail and CSV is escaped', () => {
  assert.throws(() => listSchedule(config,'2026-02-30'));
  assert.throws(() => listSchedule(config,'2020-01-01'));
  assert.equal(toCsv([{date:'2026-01-01',station:'A,"B'}]),'出題日,出題駅\n2026-01-01,"A,""B"\n');
});

test('CLI emits only CSV on stdout, is cwd-independent, and rejects missing date', () => {
  const script=path.join(__dirname,'list-schedule.cjs');
  const ok=spawnSync(process.execPath,[script,'2029-08-05'],{cwd:__dirname,encoding:'utf8'});
  assert.equal(ok.status,0); assert.equal(ok.stderr,'');
  assert.equal(ok.stdout,toCsv(listSchedule(config,'2029-08-05')));
  const bad=spawnSync(process.execPath,[script],{encoding:'utf8'});
  assert.equal(bad.status,1); assert.equal(bad.stdout,'');
});
