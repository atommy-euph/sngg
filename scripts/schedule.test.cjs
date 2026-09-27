require('./load-typescript.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolveScheduleState, shuffled } = require('../src/lib/schedule.ts');
const { toDayNumber, toDateString, localDateString, EPOCH_DAY } = require('../src/lib/scheduleDates.ts');
const { createRevision } = require('../src/lib/scheduleAuthoring.ts');
const real = require('../src/constants/schedule.json');
const orderOf = r => r.legacy ? r.order : shuffled(r.candidates,r.seed,r.previous).slice(r.skip || 0);
const data = names => Object.fromEntries(names.map(n => [n, [{ title: n, url: 'https://example.com' }]]));
const fixture = () => ({ revisions: [{ referenceDate: '2026-01-01', effective: '2026-01-01', cycle: 1, fullShuffle: '2026-01-01', seen: [], candidates: ['A','B','C','D','E'], seed: '14', active: data(['A','B','C','D','E']) }] });

test('saved games retain puzzle numbers across the rename and write only the new key', () => {
  const { loadGameStateFromLocalStorage, saveGameStateToLocalStorage } = require('../src/lib/localStorage.ts');
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let stored = null;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
  } });
  try {
    assert.equal(loadGameStateFromLocalStorage(), null);
    const base = { guesses: ['トウキョウ'], solution: 'トウキョウ' };
    for (const [fields, expected] of [[{}, undefined], [{ solutionIndex: 1688 }, 1688],
      [{ puzzleNumber: 1689 }, 1689], [{ puzzleNumber: 0, solutionIndex: 1688 }, 0]]) {
      stored = JSON.stringify({ ...base, ...fields });
      const loaded = loadGameStateFromLocalStorage();
      assert.deepEqual(loaded, { ...base, puzzleNumber: expected });
      saveGameStateToLocalStorage(loaded);
      const saved = JSON.parse(stored);
      assert.equal(saved.puzzleNumber, expected);
      assert.equal(Object.hasOwn(saved, 'solutionIndex'), false);
      assert.deepEqual(saved.guesses, base.guesses);
    }
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else delete globalThis.localStorage;
  }
});

test('legacy compatibility repeats only the old order and retains its shuffle date', () => {
  const config={revisions:[{referenceDate:'2025-12-01',effective:'2026-01-01',cycle:1,
    fullShuffle:'2025-11-25',seen:[],legacy:true,order:['A','B','C'],active:data(['A','B','C'])}]};
  for(let i=0;i<10;i++) {
    const state=resolveScheduleState(config,toDateString(toDayNumber('2026-01-01')+i));
    assert.equal(state.solution,['A','B','C'][i%3]);
    assert.equal(state.cycle,1+Math.floor(i/3));
    assert.equal(state.fullShuffle,'2025-11-25');
    assert.deepEqual(state.seen,['A','B','C'].slice(0,i%3));
  }
});

test('migration preserves legacy days, excludes every already asked station', () => {
  const first = real.revisions[0], migration = real.revisions[1];
  const elapsed = toDayNumber(migration.effective) - toDayNumber(first.effective);
  for (let i = 1; i < elapsed; i++) assert.equal(resolveScheduleState(real, toDateString(toDayNumber(first.effective)+i)).solution, first.order[i]);
  assert.equal(toDayNumber(first.effective) - EPOCH_DAY, 1378);
  assert.equal(new Set([...migration.seen, ...orderOf(migration)]).size, Object.keys(first.active).length);
  assert.equal(migration.seen.length + orderOf(migration).length, Object.keys(first.active).length);
  assert.deepEqual(migration.seen, first.order.slice(0,elapsed).sort());
  assert.equal(migration.fullShuffle, '2025-11-25');
});
test('each full cycle covers every station once and never repeats at boundary', () => {
  const config = fixture();
  let previous;
  for (let cycle = 0; cycle < 100; cycle++) {
    const answers = [];
    for (let i=0;i<5;i++) {
      const state = resolveScheduleState(config,toDateString(toDayNumber('2026-01-01')+cycle*5+i));
      if(i===0) { assert.notEqual(state.solution,previous); assert.equal(state.fullShuffle,toDateString(toDayNumber('2026-01-01')+cycle*5)); }
      answers.push(state.solution); previous=state.solution;
    }
    assert.deepEqual(answers.slice().sort(), ['A','B','C','D','E']);
  }
});
test('seed reproducibility, input order independence, boundary correction', () => {
  const a = shuffled(['A','B','C'], 'test');
  assert.deepEqual(a, shuffled(['C','A','B'],'test'));
  const b = shuffled(['A','B','C'],'test',a[0]);
  assert.notEqual(b[0],a[0]);
  assert.deepEqual(b.slice().sort(),a.slice().sort());
});
test('addition and removal preserve past and exclude seen names', () => {
  const config=fixture();
  const next=createRevision(config,data(['B','C','E','X']),'2026-01-03');
  config.revisions.push(next);
  assert.equal(resolveScheduleState(config,'2026-01-01').solution,'A');
  assert.deepEqual(orderOf(next).slice().sort(),['C','E','X']);
  assert.equal(next.fullShuffle,'2026-01-01');
  assert.deepEqual(Object.keys(resolveScheduleState(config,'2026-01-02').active),['A','B','C','D','E']);
  assert.deepEqual(Object.keys(resolveScheduleState(config,'2026-01-03').active),['B','C','E','X']);
});
test('reopened station becomes a new candidate', () => {
  const config=fixture();
  config.revisions.push(createRevision(config,data(['B','C','D','E']),'2026-01-03'));
  const next=createRevision(config,data(['A','B','C','D','E']),'2026-01-04');
  assert.ok(orderOf(next).includes('A'));
  assert.ok(!next.seen.includes('A'));
});
test('removal of all remaining names starts a cycle without consecutive duplicate', () => {
  const config=fixture();
  const next=createRevision(config,data(['A','B']),'2026-01-03');
  assert.equal(next.fullShuffle,'2026-01-03');
  assert.equal(next.cycle,2);
  assert.notEqual(orderOf(next)[0],'B');
});
test('update on a natural cycle boundary uses complete new list', () => {
  const config=fixture();
  const next=createRevision(config,data(['A','B','C','D','E','X']),'2026-01-06');
  assert.equal(next.cycle,2);
  assert.equal(next.fullShuffle,'2026-01-06');
  assert.equal(orderOf(next).length,6);
  assert.notEqual(orderOf(next)[0],'E');
});
test('addition is not always placed last', () => {
  const positions=new Set();
  for(let i=0;i<20;i++) positions.add(shuffled(['A','B','X'],String(i)).indexOf('X'));
  assert.equal(positions.size,3);
});
test('date validation and local calendar dates', () => {
  assert.throws(()=>toDayNumber('2026-02-30'));
  assert.throws(()=>toDayNumber('2026-2-3'));
  assert.equal(toDateString(toDayNumber('2028-02-29')+1),'2028-03-01');
  assert.equal(localDateString(new Date(2026,8,24,23,59)),'2026-09-24');
  assert.throws(()=>createRevision(fixture(),data(['A']),'2026-01-03'));
});

test('real migration into 30 full cycles: no boundary repeat or missing entries', () => {
  const migration=real.revisions[1];
  const size=Object.keys(migration.active).length;
  let start=toDayNumber(migration.effective)+orderOf(migration).length;
  let previous=orderOf(migration)[orderOf(migration).length-1];
  for(let i=0;i<30;i++) {
    const state=resolveScheduleState(real,toDateString(start));
    assert.notEqual(state.solution,previous);
    assert.equal(state.fullShuffle,toDateString(start));
    assert.equal(new Set(state.order).size,size);
    previous=state.order[size-1];
    start+=size;
  }
});

test('page-load snapshot stays fixed after midnight; explicit new dates advance', () => {
  const NativeDate=Date;
  let clock=new NativeDate(2026,8,30,23,59,59);
  global.Date=class extends NativeDate {
    constructor(...args) { super(...(args.length ? args : [clock.getTime()])); }
    static now() { return clock.getTime(); }
  };
  try {
    const words=require('../src/lib/words.ts');
    const old=words.getWordOfTheDay();
    clock=new NativeDate(2026,9,1,0,1);
    assert.deepEqual(words.getWordOfTheDay(),old);
    const next=words.getWordOfTheDay(clock);
    assert.equal(next.puzzleNumber,old.puzzleNumber+1);
    assert.equal(next.solution_yesterday,old.solution);
    assert.equal(next.solution,orderOf(real.revisions[1])[0]);
    assert.equal(words.stationReferenceDate,'2026年4月2日');
    assert.equal(words.fullShuffleDate,'2025/11/25');
  } finally { global.Date=NativeDate; delete require.cache[require.resolve('../src/lib/words.ts')]; }
});

test('update command: idempotency, reference date, metadata, additions, validation', () => {
  const fs=require('fs'), vm=require('vm'), path=require('path');
  const source=fs.readFileSync(path.join(__dirname,'update-schedule.cjs'),'utf8');
  let stored={revisions:[{referenceDate:'2025-12-01',
    effective:'2026-01-01',cycle:1,fullShuffle:'2026-01-01',seen:[],
    order:['AAAAA','BBBBB','CCCCC','DDDDD','EEEEE'],active:data(['AAAAA','BBBBB','CCCCC','DDDDD','EEEEE']),legacy:true
  }]};
  let active=structuredClone(stored.revisions[0].active), today='2026-01-01';
  const legacyOrder=stored.revisions[0].order.slice();
  const run=(...args)=>{
    let pending;
    const process={argv:['node','update',...args],exitCode:0};
    vm.runInNewContext(source,{
      __dirname,process,Date,console:{log(){},error(){}},
      require(id){
        if(id==='./load-typescript.cjs')return {};
        if(id==='fs')return {existsSync:()=>true,readFileSync:p=>JSON.stringify(p.endsWith('legacy-order.json')?legacyOrder:stored),writeFileSync:(_p,s)=>{pending=JSON.parse(s);},renameSync:()=>{stored=pending;}};
        if(id==='path')return path;
        if(id.includes('scheduleValidation.ts'))return require('../src/lib/scheduleValidation.ts');
        if(id.includes('scheduleDates.ts'))return {...require('../src/lib/scheduleDates.ts'),localDateString:()=>today};
        if(id.includes('scheduleAuthoring.ts'))return require('../src/lib/scheduleAuthoring.ts');
        if(id.includes('schedule.ts'))return require('../src/lib/schedule.ts');
        if(id.includes('station_names'))return {STATION_DATA:active};
        throw Error(id);
      }
    });
    return process.exitCode;
  };
  assert.equal(run('2026-01-03','--init'),0);
  const once=JSON.stringify(stored);
  assert.equal(run('2026-01-03','--init'),0);
  assert.equal(JSON.stringify(stored),once);
  assert.equal(run('2026-01-04','--init','--replace-pending'),0);
  assert.equal(stored.revisions[0].order.length,3);
  assert.equal(run('2026-01-03','--init','--replace-pending'),0);
  assert.equal(JSON.stringify(stored),once);
  today='2026-01-02';
  assert.equal(run('2026-01-03','--init'),0);
  assert.equal(stored.revisions.at(-1).referenceDate,today);
  assert.equal(resolveScheduleState(stored,'2026-01-02').referenceDate,'2025-12-01');
  assert.equal(resolveScheduleState(stored,'2026-01-03').referenceDate,today);
  assert.deepEqual(stored.revisions.map(({referenceDate,...r})=>r),JSON.parse(once).revisions.map(({referenceDate,...r})=>r));
  today='2026-01-04';
  const oldFuture=resolveScheduleState(stored,'2026-01-05').solution;
  active.AAAAA=[{title:'new title',url:'https://example.com/new'}];
  assert.equal(run('2026-01-05'),0);
  assert.equal(resolveScheduleState(stored,'2026-01-05').solution,oldFuture);
  assert.notEqual(resolveScheduleState(stored,'2026-01-04').active.AAAAA[0].title,'new title');
  assert.equal(resolveScheduleState(stored,'2026-01-05').active.AAAAA[0].title,'new title');
  assert.equal(stored.revisions.at(-1).order,undefined);
  assert.ok(stored.revisions.at(-1).seed);
  today='2026-01-06';
  active.XXXXX=[{title:'new',url:'https://example.com/x'}];
  assert.equal(run('2026-01-07'),0);
  assert.ok(stored.revisions.at(-1).candidates.includes('XXXXX'));
  const saved=JSON.stringify(stored);
  assert.equal(run('2026-01-06'),1);
  assert.equal(run('2026-02-30'),1);
  assert.equal(JSON.stringify(stored),saved);
  today='2026-01-08';
  const expected=Array.from({length:30},(_,i)=>resolveScheduleState(stored,toDateString(toDayNumber('2026-01-09')+i)).solution);
  assert.equal(run('2026-01-09'),0); // No station or link changes: date-only revision.
  assert.equal(resolveScheduleState(stored,'2026-01-08').referenceDate,'2026-01-06');
  assert.equal(resolveScheduleState(stored,'2026-01-09').referenceDate,'2026-01-08');
  assert.deepEqual(Array.from({length:30},(_,i)=>resolveScheduleState(stored,toDateString(toDayNumber('2026-01-09')+i)).solution),expected);
});

test('reference date changes with active station data on the effective date', () => {
  const config=fixture();
  const next=createRevision(config,data(['B','C','D','E','X']),'2026-01-03');
  next.referenceDate='2026-01-02';
  config.revisions.push(next);
  const before=resolveScheduleState(config,'2026-01-02'),after=resolveScheduleState(config,'2026-01-03');
  assert.equal(before.referenceDate,'2026-01-01');
  assert.ok(before.active.A);assert.equal(before.active.X,undefined);
  assert.equal(after.referenceDate,'2026-01-02');
  assert.equal(after.active.A,undefined);assert.ok(after.active.X);
  assert.equal(resolveScheduleState(real,'2026-09-30').referenceDate,'2026-04-02');
  assert.equal(resolveScheduleState(real,'2026-10-01').referenceDate,'2026-09-22');
});

test('published recipes contain no literal post-migration order', () => {
  assert.equal(Object.hasOwn(real, 'version'), false);
  for(const r of real.revisions.filter(r=>!r.legacy)) {
    assert.equal(r.order,undefined);
    assert.ok(r.seed);
    assert.deepEqual(r.candidates,r.candidates.slice().sort());
    assert.deepEqual(r.seen,r.seen.slice().sort());
  }
  assert.equal(real.revisions[0].order.length,toDayNumber(real.revisions[1].effective)-toDayNumber(real.revisions[0].effective));
  for(const r of real.revisions) assert.deepEqual(Object.keys(r.active),Object.keys(r.active).sort());
});

test('successive metadata-only updates retain recipes across cycle boundaries', () => {
  const original=fixture(), config=fixture();
  for(const date of ['2026-01-03','2026-01-04','2026-01-06','2026-01-08']) {
    const current=resolveScheduleState(config,date);
    const updated = structuredClone(current.active);
    updated.A[0].title = 'Updated ' + date;
    config.revisions.push(createRevision(config, updated, date));
  }
  for(let i=0;i<50;i++) {
    const date=toDateString(toDayNumber('2026-01-01')+i);
    assert.equal(resolveScheduleState(config,date).solution,resolveScheduleState(original,date).solution);
    assert.equal(resolveScheduleState(config,date).fullShuffle,resolveScheduleState(original,date).fullShuffle);
  }
  for(const r of config.revisions) assert.equal(r.order,undefined);
});

test('JSON validation rejects malformed revisions with useful errors', () => {
  const { readSchedule } = require('../src/lib/scheduleValidation.ts');
  assert.doesNotThrow(() => readSchedule(real));
  for (const change of [
    r => { r.legacy = true; }, r => { delete r.candidates; },
    r => { r.legacy = 'true'; }, r => { r.seed = 4; },
    r => { r.skip = -1; }, r => { r.skip = 5; }, r => { r.skip = 0.5; },
    r => { r.cycle = 0; }, r => { r.seen = null; },
    r => { r.effective = '2026-02-30'; }, r => { r.active.A = [{title:'A'}]; },
    r => { r.candidates.push('A'); }
  ]) {
    const config = fixture(); change(config.revisions[0]);
    assert.throws(() => readSchedule(config), /出題設定|日付/);
  }
  const duplicate = fixture(); duplicate.revisions.push(structuredClone(duplicate.revisions[0]));
  assert.throws(() => readSchedule(duplicate), /適用日/);
  assert.throws(() => readSchedule({ revisions: [] }), /revisions/);
});

test('source checks detect forgotten updates while allowing historical snapshots', () => {
  const { assertStationDataMatches } = require('./check-schedule.cjs');
  const { STATION_DATA } = require('../src/constants/station_names_5_katakana.ts');
  assert.doesNotThrow(() => assertStationDataMatches(real, STATION_DATA));
  const config = fixture();
  const latest = createRevision(config, data(['A','B','C','D','E','X']), '2026-01-03');
  config.revisions.push(latest);
  const reordered = Object.fromEntries(Object.entries(latest.active).reverse());
  assert.doesNotThrow(() => assertStationDataMatches(config, reordered));
  for (const change of [a => { delete a.X; }, a => { a.Y = a.X; }, a => { a.A[0].url += '/changed'; }]) {
    const source = structuredClone(latest.active); change(source);
    assert.throws(() => assertStationDataMatches(config, source), /schedule:update/);
  }
});

test('browser day resolution exposes only the public daily state', () => {
  const { resolveDay } = require('../src/lib/schedule.ts');
  for (const date of ['2026-09-30', '2026-10-01', '2029-08-06']) {
    const day = resolveDay(real, date), state = resolveScheduleState(real, date);
    assert.deepEqual(Object.keys(day).sort(), ['active','fullShuffle','referenceDate','solution']);
    for (const key of Object.keys(day)) assert.deepEqual(day[key], state[key]);
  }
});
