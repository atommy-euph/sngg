import { ColorMode} from 'native-base'
import { solution } from './words'
import { correctColor, presentColor, absentColor, lightKeyColor, darkKeyColor, lightBorderColor, darkBorderColor } from '../constants/colors'

export type CharStatus = "absent" | "present" | "correct"

export function getStatuses(guesses: string[]) :{ [key: string]: CharStatus }{
  const charObj : { [key: string]: CharStatus } = {}

  guesses.forEach((word) => {
    word.split("").forEach((letter, i) => {
      const splitSolution = solution.split("")
      if (!splitSolution.includes(letter)){
        return (charObj[letter] = "absent")
      }
      if (letter === splitSolution[i]) {
        return (charObj[letter] = 'correct')
      }
      if (charObj[letter] !== 'correct') {
        return (charObj[letter] = 'present')
      }
     }
  )})
  return charObj
}

export function getGuessStatuses(guess: string) : CharStatus[] {

  const splitSolution = solution.split("")
  const splitGuess = guess.split("")

  const solutionCharsTaken = splitSolution.map((_) => false)
  const statuses: CharStatus[] = Array.from(Array(splitGuess.length))

  splitGuess.forEach((letter, i) => {
    if (letter === splitSolution[i]) {
      statuses[i] = "correct"
      solutionCharsTaken[i] = true
      return
    }
  })
  splitGuess.forEach((letter, i) => {
    if(statuses[i]) return

    if(!splitSolution.includes(letter)) {
      statuses[i] = "absent"
      return
    }

    const indexOfPresentChar = splitSolution.findIndex(
      (x, index) => x === letter && !solutionCharsTaken[index]
    )
    if (indexOfPresentChar > -1) {
      statuses[i] = 'present'
      solutionCharsTaken[indexOfPresentChar] = true
      return
    } else {
      statuses[i] = 'absent'
      return
    }

  })

  return statuses
}


export function getColors(status: CharStatus, colorMode: ColorMode) : {bgColor: string, borderColor: string, keyColor: string}{

  let bgColor = "None"
  let borderColor = colorMode === "light" ? lightBorderColor : darkBorderColor
  let keyColor = colorMode === "light" ? lightKeyColor : darkKeyColor

  if (status === "correct") {
    bgColor = correctColor
    borderColor = correctColor
    keyColor = correctColor
  } else if (status === "present") {
    bgColor = presentColor
    borderColor = presentColor
    keyColor = presentColor
  } else {
    bgColor = absentColor
    borderColor = absentColor
    keyColor = absentColor
  }

  return {bgColor, borderColor, keyColor}
}

  