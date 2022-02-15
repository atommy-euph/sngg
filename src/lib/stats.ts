import {
  GameStats,
  loadGameStatsFromLocalStorage,
  saveGameStatsToLocalStorage,
} from './localStorage'
import { GUESS_MAX } from '../constants/settings'

export const addGameStatsForCompletedGame = (
    gameStats: GameStats,
    count:number
) => {

  // Count is number of incorrect guesses before end.
  const stats = { ...gameStats }

  stats.totalGames += 1

  if (count >= GUESS_MAX) {
    // A fail situation
    stats.currentStreak = 0
    stats.gamesFailed += 1
  } else {
    stats.winDistribution[count] += 1
    stats.currentStreak += 1

    if (stats.bestStreak < stats.currentStreak) {
      stats.bestStreak = stats.currentStreak
    }
  }

  stats.successRate = getSuccessRate(stats)

  saveGameStatsToLocalStorage(stats)
  return stats
}

const defaultStats: GameStats = {
  winDistribution: new Array(GUESS_MAX).fill(0),
  gamesFailed: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalGames: 0,
  successRate: 0,
}

export const loadStats = () => {
  return loadGameStatsFromLocalStorage() || defaultStats
}


const getSuccessRate = (gameStats: GameStats) => {
  const { totalGames, gamesFailed } = gameStats

  return Math.round(
    (100 * (totalGames - gamesFailed)) / Math.max(totalGames, 1)
  )
}
