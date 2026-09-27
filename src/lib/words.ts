// schedule.jsonはschedule:updateの生成物。駅データの正本を編集し、JSONは手編集しない。
import config from '../constants/schedule.json';
import { Schedule, resolveDay } from './schedule';
import { localDateString, toDayNumber, toDateString, EPOCH_DAY } from './scheduleDates';

const schedule = config as Schedule;
// solution（当日の答え）とpuzzleNumber（通算問題番号）は、ページ読込時に
// ブラウザ内で計算し、各画面で共有する。画面側での再計算を避け、
// 日付をまたいでも読込時の問題を維持する。puzzleNumberは駅一覧の配列インデックスではない。
const openedAt = new Date();
const today = localDateString(openedAt);
const current = resolveDay(schedule, today);
export const ACTIVE_STATION_DATA = current.active;
export const NAMES = Object.keys(ACTIVE_STATION_DATA);
export const fullShuffleDate = current.fullShuffle.replace(/-/g, '/');
const [referenceYear, referenceMonth, referenceDay] = current.referenceDate.split('-').map(Number);
export const stationReferenceDate = `${referenceYear}年${referenceMonth}月${referenceDay}日`;

export const getWordOfTheDay = (now: Date = openedAt) => {
  const date = localDateString(now);
  const day = toDayNumber(date);
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    solution: resolveDay(schedule, date).solution,
    solution_yesterday: resolveDay(schedule, toDateString(day - 1)).solution,
    puzzleNumber: day - EPOCH_DAY,
    tomorrow: next.getTime() - now.getTime(),
  };
};
export const { solution, solution_yesterday, puzzleNumber, tomorrow } = getWordOfTheDay();
export const isWinningWord = (word: string): boolean => solution === word;
export const isInWordList = (word: string): boolean => NAMES.includes(word);
