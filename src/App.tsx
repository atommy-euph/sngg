import { useEffect, useState } from "react";
import { Box, useColorMode, VStack, Spacer } from "native-base";
import { useAlert } from "react-alert";

import { AppBar } from "./components/header/AppBar";
import { Grid } from "./components/grid/Grid";
import { KeyBoard } from "./components/keyboard/KeyBoard";
import { HowToPlayModal } from "./components/modal/HowToPlayModal";

import { lightBgColor, darkBgColor } from "./constants/colors";
import { SIZE, GUESS_MAX } from "./constants/settings";

import { isInWordList, isWinningWord } from "./lib/words";

function App() {
  const { colorMode } = useColorMode();
  const alert = useAlert();

  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameLost, setIsGameLost] = useState(false);

  useEffect(() => {
    if (isGameWon) {
      alert.success("すばらしい！");
      // 統計情報・シェアボタンを表示
    }
    if (isGameLost) {
      alert.show("残念...");
    }
  }, [isGameWon, isGameLost]);

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
      alert.error("文字数が不足しています");
      return;
    }
    if (!isInWordList(currentGuess) && !isGameLost) {
      alert.error("存在しない駅名です");
      return;
    }
    // + 存在する駅名かチェック
    const winningWord = isWinningWord(currentGuess);

    if (
      currentGuess.split("").length === SIZE &&
      guesses.length < GUESS_MAX &&
      !isGameWon
    ) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");

      if (winningWord) {
        //統計を更新
        return setIsGameWon(true);
      }

      if (guesses.length === GUESS_MAX - 1) {
        //統計を更新
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
        <AppBar handleHowToPlayModal={() => setIsHowToPlayModalOpen(true)} />
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
    </Box>
  );
}

export default App;
