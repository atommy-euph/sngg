import React, { useState } from "react";
import { Center, HStack, Square, VStack } from "native-base";
import { getStatuses } from "../../lib/statuses";

import { Key } from "./Key";

interface Props {
  onChar: (value: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  guesses: string[];
}

export const KeyBoard = React.memo(function KeyBoard({
  onChar,
  onDelete,
  onEnter,
  guesses,
}: Props) {
  const [isToggled, setIsToggled] = useState(false);

  const charStatuses = getStatuses(guesses);
  const keySpace = "3px";

  const onClick = (value: string) => {
    if (value === "delete") {
      onDelete();
    } else if (value === "toggle") {
      setIsToggled(!isToggled);
    } else if (value === "enter") {
      onEnter();
    } else {
      onChar(value);
    }
  };

  return (
    <Center flex={1} alignItems="center">
      <VStack space={keySpace}>
        <HStack space={keySpace} justifyContent="space-between">
          <Key value="enter" onClick={onClick}>
            Enter
          </Key>
          <Key value="toggle" onClick={onClick}>
            {isToggled ? " カナ" : "゛゜小 ー"}
          </Key>
          <Key value="delete" onClick={onClick}>
            {"<"}Delete
          </Key>
        </HStack>
        <>
          <HStack display={!isToggled ? "flex" : "none"} space={keySpace}>
            <VStack space={keySpace}>
              <Key value="ア" onClick={onClick} status={charStatuses["ア"]} />
              <Key value="イ" onClick={onClick} status={charStatuses["イ"]} />
              <Key value="ウ" onClick={onClick} status={charStatuses["ウ"]} />
              <Key value="エ" onClick={onClick} status={charStatuses["エ"]} />
              <Key value="オ" onClick={onClick} status={charStatuses["オ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="カ" onClick={onClick} status={charStatuses["カ"]} />
              <Key value="キ" onClick={onClick} status={charStatuses["キ"]} />
              <Key value="ク" onClick={onClick} status={charStatuses["ク"]} />
              <Key value="ケ" onClick={onClick} status={charStatuses["ケ"]} />
              <Key value="コ" onClick={onClick} status={charStatuses["コ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="サ" onClick={onClick} status={charStatuses["サ"]} />
              <Key value="シ" onClick={onClick} status={charStatuses["シ"]} />
              <Key value="ス" onClick={onClick} status={charStatuses["ス"]} />
              <Key value="セ" onClick={onClick} status={charStatuses["セ"]} />
              <Key value="ソ" onClick={onClick} status={charStatuses["ソ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="タ" onClick={onClick} status={charStatuses["タ"]} />
              <Key value="チ" onClick={onClick} status={charStatuses["チ"]} />
              <Key value="ツ" onClick={onClick} status={charStatuses["ツ"]} />
              <Key value="テ" onClick={onClick} status={charStatuses["テ"]} />
              <Key value="ト" onClick={onClick} status={charStatuses["ト"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ナ" onClick={onClick} status={charStatuses["ナ"]} />
              <Key value="ニ" onClick={onClick} status={charStatuses["ニ"]} />
              <Key value="ヌ" onClick={onClick} status={charStatuses["ヌ"]} />
              <Key value="ネ" onClick={onClick} status={charStatuses["ネ"]} />
              <Key value="ノ" onClick={onClick} status={charStatuses["ノ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ハ" onClick={onClick} status={charStatuses["ハ"]} />
              <Key value="ヒ" onClick={onClick} status={charStatuses["ヒ"]} />
              <Key value="フ" onClick={onClick} status={charStatuses["フ"]} />
              <Key value="ヘ" onClick={onClick} status={charStatuses["ヘ"]} />
              <Key value="ホ" onClick={onClick} status={charStatuses["ホ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="マ" onClick={onClick} status={charStatuses["マ"]} />
              <Key value="ミ" onClick={onClick} status={charStatuses["ミ"]} />
              <Key value="ム" onClick={onClick} status={charStatuses["ム"]} />
              <Key value="メ" onClick={onClick} status={charStatuses["メ"]} />
              <Key value="モ" onClick={onClick} status={charStatuses["モ"]} />
            </VStack>
            <VStack space={keySpace} justifyContent="space-between">
              <Key value="ヤ" onClick={onClick} status={charStatuses["ヤ"]} />
              <Key value="ユ" onClick={onClick} status={charStatuses["ユ"]} />
              <Key value="ヨ" onClick={onClick} status={charStatuses["ヨ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ラ" onClick={onClick} status={charStatuses["ラ"]} />
              <Key value="リ" onClick={onClick} status={charStatuses["リ"]} />
              <Key value="ル" onClick={onClick} status={charStatuses["ル"]} />
              <Key value="レ" onClick={onClick} status={charStatuses["レ"]} />
              <Key value="ロ" onClick={onClick} status={charStatuses["ロ"]} />
            </VStack>
            <VStack space={keySpace} justifyContent="space-between">
              <Key value="ワ" onClick={onClick} status={charStatuses["ワ"]} />
            </VStack>
            <VStack space={keySpace} justifyContent="space-between">
              <Key value="ン" onClick={onClick} status={charStatuses["ン"]} />
            </VStack>
          </HStack>
          <HStack display={isToggled ? "flex" : "none"} space={keySpace}>
            <VStack space={keySpace}>
              <Key value="ァ" onClick={onClick} status={charStatuses["ァ"]} />
              <Key value="ィ" onClick={onClick} status={charStatuses["ィ"]} />
              <Key value="ヴ" onClick={onClick} status={charStatuses["ヴ"]} />
              <Key value="ェ" onClick={onClick} status={charStatuses["ェ"]} />
              <Key value="ォ" onClick={onClick} status={charStatuses["ォ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ガ" onClick={onClick} status={charStatuses["ガ"]} />
              <Key value="ギ" onClick={onClick} status={charStatuses["ギ"]} />
              <Key value="グ" onClick={onClick} status={charStatuses["グ"]} />
              <Key value="ゲ" onClick={onClick} status={charStatuses["ゲ"]} />
              <Key value="ゴ" onClick={onClick} status={charStatuses["ゴ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ザ" onClick={onClick} status={charStatuses["ザ"]} />
              <Key value="ジ" onClick={onClick} status={charStatuses["ジ"]} />
              <Key value="ズ" onClick={onClick} status={charStatuses["ズ"]} />
              <Key value="ゼ" onClick={onClick} status={charStatuses["ゼ"]} />
              <Key value="ゾ" onClick={onClick} status={charStatuses["ゾ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="ダ" onClick={onClick} status={charStatuses["ダ"]} />
              <Key value="ヂ" onClick={onClick} status={charStatuses["ヂ"]} />
              <Key value="ヅ" onClick={onClick} status={charStatuses["ヅ"]} />
              <Key value="デ" onClick={onClick} status={charStatuses["デ"]} />
              <Key value="ド" onClick={onClick} status={charStatuses["ド"]} />
            </VStack>
            <VStack justifyContent="space-between" space={keySpace}>
              <Square
                w={`${7.9}vw`}
                h={`${7.9}vw`}
                maxW={"35px"}
                maxH={"35px"}
              />
              <Key value="ッ" onClick={onClick} status={charStatuses["ッ"]} />
              <Key value="ー" onClick={onClick} status={charStatuses["ー"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="バ" onClick={onClick} status={charStatuses["バ"]} />
              <Key value="ビ" onClick={onClick} status={charStatuses["ビ"]} />
              <Key value="ブ" onClick={onClick} status={charStatuses["ブ"]} />
              <Key value="ベ" onClick={onClick} status={charStatuses["ベ"]} />
              <Key value="ボ" onClick={onClick} status={charStatuses["ボ"]} />
            </VStack>
            <VStack space={keySpace}>
              <Key value="パ" onClick={onClick} status={charStatuses["パ"]} />
              <Key value="ピ" onClick={onClick} status={charStatuses["ピ"]} />
              <Key value="プ" onClick={onClick} status={charStatuses["プ"]} />
              <Key value="ペ" onClick={onClick} status={charStatuses["ペ"]} />
              <Key value="ポ" onClick={onClick} status={charStatuses["ポ"]} />
            </VStack>
            <VStack justifyContent="space-between" space={keySpace}>
              <Key value="ャ" onClick={onClick} status={charStatuses["ャ"]} />
              <Key value="ュ" onClick={onClick} status={charStatuses["ュ"]} />
              <Key value="ョ" onClick={onClick} status={charStatuses["ョ"]} />
            </VStack>
            <VStack justifyContent="space-between" space={keySpace}>
              <Key value="1" onClick={onClick} status={charStatuses["1"]} />
              <Key value="2" onClick={onClick} status={charStatuses["2"]} />
              <Key value="3" onClick={onClick} status={charStatuses["3"]} />
              <Key value="4" onClick={onClick} status={charStatuses["4"]} />
              <Key value="5" onClick={onClick} status={charStatuses["5"]} />
            </VStack>
            <VStack justifyContent="space-between" space={keySpace}>
              <Key value="6" onClick={onClick} status={charStatuses["6"]} />
              <Key value="7" onClick={onClick} status={charStatuses["7"]} />
              <Key value="8" onClick={onClick} status={charStatuses["8"]} />
              <Key value="9" onClick={onClick} status={charStatuses["9"]} />
              <Key value="G" onClick={onClick} status={charStatuses["G"]} />
            </VStack>
            <VStack justifyContent="space-between" space={keySpace}>
              <Key value="A" onClick={onClick} status={charStatuses["A"]} />
              <Key value="J" onClick={onClick} status={charStatuses["J"]} />
              <Key value="P" onClick={onClick} status={charStatuses["P"]} />
              <Key value="R" onClick={onClick} status={charStatuses["R"]} />
              <Key value="Y" onClick={onClick} status={charStatuses["Y"]} />
            </VStack>
          </HStack>
        </>
      </VStack>
    </Center>
  );
});
