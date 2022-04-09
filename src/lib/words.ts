import {SIZE} from "../constants/settings"
import NAMEDATA from "../constants/station_names.json"

export const NAMES = NAMEDATA[SIZE]
export const NumberOfData = NAMEDATA[SIZE].length

export const isWinningWord = (word: string): boolean => {
  return solution === word
}

export const isInWordList = (word: string): boolean => {
  return NAMES.includes(word)
}


export const getWordOfTheDay = () => {
  const epochMs = new Date('February 16, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay) % NumberOfData
  const nextday = (index + 1) * msInDay + epochMs - now
  console.log(NAMES[index])
  return {
      solution_yesterday: NAMES[index-1],
      solution: NAMES[index],
      solutionIndex: index,
      tomorrow: nextday
    }
  }


export const {solution, solution_yesterday, solutionIndex, tomorrow} = getWordOfTheDay()
