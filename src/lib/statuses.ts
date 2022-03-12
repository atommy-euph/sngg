import { ColorMode} from 'native-base'
import { solution } from './words'
import { groups } from '../constants/groups'
import { correctColor, presentColor,samegroupColor, absentColor, lightKeyColor, darkKeyColor, lightBorderColor, darkBorderColor } from '../constants/colors'
import { NAMES } from "../lib/words"

export type CharStatus = "absent" | "samegroup" |"present" | "correct"


export function getCandidatesCount(guesses: string[]): number {

  const candidates = NAMES.filter((name) => {
    for(let i = 0; i < guesses.length; i++) {
      if(!status_equal(getGuessStatuses(guesses[i]), getStatusesOfTwoName(guesses[i], name))){
        return false
      } 
    }
    return true
  })
  
  return candidates.length
}

function status_equal(a: CharStatus[], b: CharStatus[]) {
  if (!Array.isArray(a))    return false;
  if (!Array.isArray(b))    return false;
  if (a.length !== b.length) return false;
  for (var i = 0, n = a.length; i < n; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


export function getStatusesOfTwoName(guess: string, candidate: string) : CharStatus[]{
  let s = candidate.split("")
  let g = guess.split("")

  const statuses: CharStatus[] = Array.from(Array(s.length))

  // is correct 
  for (let i = 0; i < s.length; i++) {
    if (g[i] === s[i]) {
      statuses[i] = "correct";
      s[i] = "_";
      g[i] = "_";
    }
  }
  //is present
  for (let i = 0; i < s.length; i++) {
    if (s.includes(g[i]) && g[i] !== "_") {
      statuses[i] = "present";
      s[s.findIndex((letter) => letter === g[i])] = "_";
      g[i] = "_";
    }
  }
  // is sameShape
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < g.length; j++) {
      if (isSameGroup(s[i], g[j]) && s[i] !== "_" && g[j] !== "_") {
        s[i] = "_";
        g[j] = "_";
        statuses[j] = "samegroup";
      }
    }
  }
  // is absent
  for (let i = 0; i < s.length; i++) {
    if (g[i] !== "_") {
      statuses[i] = "absent";
    }
  }

  return statuses
}

export function getStatuses(guesses: string[]) : {[key:string]: CharStatus} {
  const charObj :{[key: string]: CharStatus } = {};

  guesses.forEach((guess) => {
    const status = getGuessStatuses(guess);
    guess.split("").forEach((letter, i) => {
      const sameGroup = groups.find((group) => group.includes(letter))
      if (!charObj[letter]) {
        charObj[letter] = status[i];
        if (charObj[letter] === "absent") {
          sameGroup?.forEach((value) => {
            if(!charObj[value]){ charObj[value] = "absent" }
           
          })
        }
      } else {
        if (status[i] === "correct") {
          charObj[letter] = "correct";
          return;
        }
        if (charObj[letter] === "correct" || charObj[letter] === "absent" ||  charObj[letter] === "samegroup") {
          return
        }
       
      }
    });
  });
  return charObj
}

export function getGuessStatuses(guess: string) : CharStatus[]{
  let s = solution.split("")
  let g = guess.split("")

  const statuses: CharStatus[] = Array.from(Array(s.length))

  // is correct 
  for (let i = 0; i < s.length; i++) {
    if (g[i] === s[i]) {
      statuses[i] = "correct";
      s[i] = "_";
      g[i] = "_";
    }
  }
  //is present
  for (let i = 0; i < s.length; i++) {
    if (s.includes(g[i]) && g[i] !== "_") {
      statuses[i] = "present";
      s[s.findIndex((letter) => letter === g[i])] = "_";
      g[i] = "_";
    }
  }
  // is sameShape
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < g.length; j++) {
      if (isSameGroup(s[i], g[j]) && s[i] !== "_" && g[j] !== "_") {
        s[i] = "_";
        g[j] = "_";
        statuses[j] = "samegroup";
      }
    }
  }
  // is absent
  for (let i = 0; i < s.length; i++) {
    if (g[i] !== "_") {
      statuses[i] = "absent";
    }
  }

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
  } else if  (status === "samegroup"){
    bgColor = samegroupColor
    borderColor = samegroupColor
    keyColor = absentColor
  }else {
    bgColor = absentColor
    borderColor = absentColor
    keyColor = absentColor
  }

  return {bgColor, borderColor, keyColor}
}

const isSameGroup = (kana1:string, kana2:string) => {
  for(let i = 0; i < groups.length; i++) {
    if(groups[i].includes(kana1) && groups[i].includes(kana2)){
      return true
    }
  }
  return false
}
  