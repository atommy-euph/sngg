import config from '../constants/schedule.json';
import { Schedule, stateAt, localDate, dateDay, dayDate, epoch } from './schedule';

const schedule: Schedule = config;
// Intentionally fixed at page load: players can finish after midnight.
const openedAt = new Date();
const today = localDate(openedAt);
const current = stateAt(schedule, today);
export const ACTIVE_STATION_DATA = current.active;
export const NAMES = Object.keys(ACTIVE_STATION_DATA);
export const NumberOfData = NAMES.length;
export const fullShuffleDate = current.fullShuffle.replace(/-/g, '/');
const [year, month, day] = current.referenceDate.split('-').map(Number);
export const stationReferenceDate = `${year}年${month}月${day}日`;

export const getWordOfTheDay = (now: Date = openedAt) => {
  const date = localDate(now);
  const day = dateDay(date);
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return {
    solution: stateAt(schedule, date).solution,
    solution_yesterday: stateAt(schedule, dayDate(day - 1)).solution,
    solutionIndex: day - epoch,
    tomorrow: next.getTime() - now.getTime(),
  };
};
export const { solution, solution_yesterday, solutionIndex, tomorrow } = getWordOfTheDay();
export const isWinningWord = (word: string): boolean => solution === word;
export const isInWordList = (word: string): boolean => NAMES.includes(word);
