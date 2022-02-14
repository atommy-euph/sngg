import {SIZE} from "../constants/settings"
import NAMEDATA from "../constants/names_classed_shuffled.json"

export const NAMES = NAMEDATA[SIZE]
export const NumberOfData = NAMEDATA[SIZE].length

export const isWinningWord = (word: string): boolean => {
  return solution === word
}

export const isInWordList = (word: string): boolean => {
  return NAMES.includes(word)
}

export const getIndexOnTheDay = ():number => {
  const epochMs = new Date('February 14, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay) % NumberOfData

  return index
}

export const getWordOfTheDay = () => {
  const index = getIndexOnTheDay()
  console.log(NAMES[index])
  return NAMES[index]
}

export const solution = getWordOfTheDay()
