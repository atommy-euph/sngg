const gameStateKey = 'gameState'

type StoredGameState = {
  guesses: string[]
  solution: string
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatsKey = "gameStats"

export type GameStats = {
  winDistribution: number[]
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
}

export const saveGameStatsToLocalStorage = (gameStats: GameStats) => {
  localStorage.setItem(gameStatsKey, JSON.stringify(gameStats))
}

export const loadGameStatsFromLocalStorage = () => {
  const gameStats = localStorage.getItem(gameStatsKey)
  return gameStats ? (JSON.parse(gameStats) as GameStats): null
}
