import { currentPuzzle } from './currentPuzzle';

export const NAMES = Object.keys(currentPuzzle.active);
export const fullShuffleDate = currentPuzzle.fullShuffle.replace(/-/g, '/');
const [referenceYear, referenceMonth, referenceDay] = currentPuzzle.referenceDate.split('-').map(Number);
export const stationReferenceDate = `${referenceYear}年${referenceMonth}月${referenceDay}日`;

// 任意日付の計算はcreatePuzzleSnapshotで行い、ここでは必ず読込時の同じ状態を返す。
export const getWordOfTheDay = () => currentPuzzle;
export const { solution, solution_yesterday, puzzleNumber, tomorrow } = currentPuzzle;
export const isWinningWord = (word: string): boolean => solution === word;
export const isInWordList = (word: string): boolean => NAMES.includes(word);
