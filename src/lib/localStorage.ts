const gameStateKey = 'gameState'

type StoredGameState = {
  guesses: string[]
  solution: string
  puzzleNumber?: number
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
  localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
  const state = localStorage.getItem(gameStateKey)
  if (!state) return null
  // 名前変更前の保存データも、通算問題番号を引き継いで復元する。
  const { solutionIndex, ...gameState } = JSON.parse(state) as StoredGameState & { solutionIndex?: number }
  return { ...gameState, puzzleNumber: gameState.puzzleNumber ?? solutionIndex }
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
