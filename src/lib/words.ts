import {NAMES} from "../constants/names"
import {SIZE} from "../constants/settings"

export const solution = "トウキョウ" //NAMESから1日一回ランダムに選択

export const isWinningWord = (word: string): boolean => {
  return solution === word
}

export const isInWordList = (word: string): boolean => {
  return NAMES.includes(word)
}

export const getWordOfDay = () => {
  
}
