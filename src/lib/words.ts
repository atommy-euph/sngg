import { STATION_DATA } from "../constants/station_names_5_katakana_shuffled";

export const NAMES = Object.keys(STATION_DATA);
export const NumberOfData = NAMES.length;

// dayOffset: 問題番号のオフセット

// ex1) 出題リストのリセット: 前日の通算日を指定
//      1392問で一巡して1393日目にリセット -> dayOffset = 1392
//export const dayOffset = 1392;

// ex2) 既出の駅のリストからの削除に対応: 削除した数を指定
//     20駅削除 -> dayOffset = 20
export const dayOffset = 24;

// リセット前日の出題駅
export const finalStation = 'ナカウラワ'

export const isWinningWord = (word: string): boolean => {
  return solution === word;
};

export const isInWordList = (word: string): boolean => {
  return NAMES.includes(word);
};

export const getWordOfTheDay = () => {
  const epochMs = new Date("February 16, 2022 00:00:00").valueOf();
  const now = Date.now();
  const msInDay = 86400000;
  const index = Math.floor((now - epochMs) / msInDay);
  const nextday = (index + 1) * msInDay + epochMs - now;
  const questionNumber = (index - dayOffset - 1) % NumberOfData;
  var lastStation;
  if (questionNumber === 0) {
    lastStation = finalStation;
  } else {
    lastStation = NAMES[questionNumber - 1];
  }

  return {
    solution_yesterday: lastStation,
    solution: NAMES[questionNumber],
    solutionIndex: index,
    tomorrow: nextday,
  };
};

export const { solution, solution_yesterday, solutionIndex, tomorrow } =
  getWordOfTheDay();
