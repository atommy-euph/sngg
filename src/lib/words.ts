import { STATION_DATA } from "../constants/station_names_5_katakana_shuffled";

export const NAMES = Object.keys(STATION_DATA);
export const NumberOfData = NAMES.length;

// dayOffset: 問題番号のオフセット
// 出題リストのリセット: 一巡する日の通算日を指定

// 2025/11/24 (1377日目) に出題が一巡。
export const dayOffset = 1377;

// リセット前日の出題駅
export const finalStation = 'ヒゴイクラ'

// リセット後、既出の駅をリストから削除した場合、削除した数を加算
//export const dayOffset = 1377 + 1;

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
