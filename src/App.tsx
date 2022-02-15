import { useEffect, useState } from "react";
import { Box, useColorMode, VStack, Spacer } from "native-base";
import { useAlert } from "react-alert";

import { AppBar } from "./components/header/AppBar";
import { Grid } from "./components/grid/Grid";
import { KeyBoard } from "./components/keyboard/KeyBoard";
import { HowToPlayModal } from "./components/modal/HowToPlayModal";
import { StatsModal } from "./components/modal/StatsModal";

import { lightBgColor, darkBgColor } from "./constants/colors";
import { SIZE, GUESS_MAX } from "./constants/settings";

import { isInWordList, isWinningWord } from "./lib/words";
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from "./lib/localStorage";
import { solution } from "./lib/words";
import { GameStats } from "./lib/localStorage";
import { loadStats, addGameStatsForCompletedGame } from "./lib/stats";

function App() {
  const { colorMode } = useColorMode();
  const alert = useAlert();

  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);
  const [stats, setStats] = useState(() => loadStats());

  const [guesses, setGuesses] = useState<string[]>(() => {
    const loaded = loadGameStateFromLocalStorage();
    if (loaded?.solution !== solution) {
      return [];
    }
    const gameWasWon = loaded.guesses.includes(solution);
    if (gameWasWon) {
      setIsGameWon(true);
    }
    if (loaded.guesses.length === GUESS_MAX && !gameWasWon) {
      setIsGameLost(true);
    }
    return loaded.guesses;
  });

  useEffect(() => {
    saveGameStateToLocalStorage({ guesses, solution });
  }, [guesses]);

  useEffect(() => {
    if (isGameWon) {
      alert.success("目的地に到着しました！");
      setTimeout(() => {
        setIsStatsModalOpen(true);
      }, 2500);
    }
    if (isGameLost) {
      alert.show("残念、途中下車...");
      setTimeout(() => {
        alert.show(`答え「${solution}」`);
        setIsStatsModalOpen(true);
      }, 2500);
    }
  }, [alert, isGameWon, isGameLost]);

  const onChar = (value: string) => {
    if (
      currentGuess.split("").length < SIZE &&
      guesses.length < GUESS_MAX &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`);
    }
  };

  const onDelete = () => {
    setCurrentGuess(currentGuess.split("").slice(0, -1).join(""));
  };

  const onEnter = () => {
    if (isGameWon) return;
    if (!(currentGuess.split("").length === SIZE) && !isGameLost) {
      alert.error(`回答は${SIZE}文字にしてください`);
      return;
    }
    if (!isInWordList(currentGuess) && !isGameLost) {
      alert.error("駅名リストにありません");
      return;
    }
    const winningWord = isWinningWord(currentGuess);

    if (
      currentGuess.split("").length === SIZE &&
      guesses.length < GUESS_MAX &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        setStats(addGameStatsForCompletedGame(stats, guesses.length));
        return setIsGameWon(true);
      }

      if (guesses.length === GUESS_MAX - 1) {
        setStats(addGameStatsForCompletedGame(stats, guesses.length + 1));
        setIsGameLost(true);
      }
    }
  };

  return (
    <Box
      bg={colorMode === "light" ? lightBgColor : darkBgColor}
      minHeight="100vh"
      justifyContent="center"
    >
      <VStack flex={1} justifyContent="space-between">
        <AppBar
          handleInfoModal={() => setIsStatsModalOpen(true)}
          handleHowToPlayModal={() => setIsHowToPlayModalOpen(true)}
        />
        <VStack justifyContent="center" space={1} flexGrow={1}>
          <Spacer />
          <Grid guesses={guesses} currentGuess={currentGuess} />
          <KeyBoard
            guesses={guesses}
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
          />
          <Spacer />
        </VStack>
      </VStack>

      <HowToPlayModal
        isOpen={isHowToPlayModalOpen}
        onCloseHowToPlayModal={() => setIsHowToPlayModalOpen(false)}
      />
      <StatsModal
        isOpen={isStatsModalOpen}
        onCloseStatsModal={() => setIsStatsModalOpen(false)}
        gameStats={stats}
      />
    </Box>
  );
}

export default App;
