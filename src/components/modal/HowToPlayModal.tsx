import React from "react";
import {
  Modal,
  Heading,
  Text,
  Link,
  Divider,
  HStack,
  useColorModeValue,
} from "native-base";
import { CellDemo } from "../grid/Cell";

import { SIZE, GUESS_MAX } from "../../constants/settings";
import {
  correctColor,
  presentColor,
  absentColor,
  lightTextColor,
  lightBgColor,
  darkBgColor,
} from "../../constants/colors";

interface Props {
  isOpen: boolean;
  onCloseHowToPlayModal: () => void;
}

export const HowToPlayModal = React.memo(function HowToPlayModal({
  isOpen,
  onCloseHowToPlayModal,
}: Props) {
  const textProps = {
    fontSize: 14,
    my: 1,
  };
  const headingProps = {
    fontSize: 14,
    my: 1,
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseHowToPlayModal}>
      <Modal.Content bg={useColorModeValue(lightBgColor, darkBgColor)}>
        <Modal.CloseButton />
        <Modal.Header _text={{ fontWeight: "bold", fontSize: 14 }}>
          遊び方・ルール
        </Modal.Header>
        <Modal.Body>
          <Heading {...headingProps}>遊び方</Heading>
          <Text {...textProps}>
            {SIZE}文字の日本の駅・停留場の名前を{GUESS_MAX}
            回以内に当てるゲームです。
          </Text>
          <Text {...textProps}>
            回答する駅名は{SIZE}
            文字で実際に存在する(リストに含まれる)必要があります。
          </Text>
          <Text fontSize={14}>
            入力後Enterを押すと、その回答と答えがどのくらい近いかによって、文字タイルの色が変わります。
          </Text>
          <Divider my={3} />
          <Text fontSize={14} mb={3} bold>
            5文字の例
          </Text>
          <HStack space={1}>
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="ド"
            />
            <CellDemo
              cellSize={9}
              borderColor={correctColor}
              bgColor={correctColor}
              fontSize={22}
              color={lightTextColor}
              value="ウ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="ゴ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="ヤ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="マ"
            />
          </HStack>
          <Text pt={2} pb={4} fontSize={14}>
            <Text fontSize={14} pr={1} bold>
              ウ
            </Text>
            は答えに含まれているし位置も正しい。
          </Text>
          <HStack space={1}>
            <CellDemo
              cellSize={9}
              borderColor={presentColor}
              bgColor={presentColor}
              fontSize={22}
              color={lightTextColor}
              value="キ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="タ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="チ"
            />
            <CellDemo
              cellSize={9}
              borderColor={correctColor}
              bgColor={correctColor}
              fontSize={22}
              color={lightTextColor}
              value="ョ"
            />
            <CellDemo
              cellSize={9}
              borderColor={correctColor}
              bgColor={correctColor}
              fontSize={22}
              color={lightTextColor}
              value="ウ"
            />
          </HStack>
          <Text pt={2} pb={4} fontSize={14}>
            <Text fontSize={14} pr={1} bold>
              キ
            </Text>
            は答えに含まれているが位置は異なる。
          </Text>
          <Text fontSize={14}>黒くなっている文字は答えに含まれません。</Text>
          <Text fontSize={14}>
            この場合、目的地は「
            <Text fontSize={14} color={correctColor} px={1} bold>
              トウキョウ
            </Text>
            」と推測できます！
          </Text>

          <Divider my={3} />
          <Heading {...headingProps}>ルール</Heading>

          <Text {...textProps}>
            ・「駅」、「停留場」は文字数に含みません。5文字の場合「シブヤエキ」は解答できません。
          </Text>
          <Text {...textProps}>
            ・アルファベットや数字など、表記と読み方が異なる場合は表記を優先します。ただし、もちろん
            {SIZE}
            文字以外の駅名は解答できません。例:「YRPノビ」「ニシ4チョウメ」「ジヤトコマエ」
          </Text>
          <Text {...textProps}>
            ・駅名に含まれる中黒、括弧は除きます。例:「栂・美木多」→「トガミキタ」
          </Text>
          <Text>
            ・駅名及びその読みは、
            <Link
              href="https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E9%89%84%E9%81%93%E9%A7%85%E4%B8%80%E8%A6%A7_%E3%81%82"
              isExternal
            >
              Wikipedia「日本の鉄道駅一覧」
            </Link>
            に2022年2月16日時点で掲載されているものに準じます。
          </Text>
          <Divider my={3} />
          <Heading {...headingProps} color="gray.400" textAlign="center">
            About this game.
          </Heading>
          <Text color="gray.400" textAlign="center">
            This game is inspired by{" "}
            <Link
              href="https://www.nytimes.com/games/wordle/index.html"
              isExternal
              _text={{ color: "gray.400" }}
            >
              Wordle
            </Link>
            .
          </Text>
        </Modal.Body>
      </Modal.Content>
      で
    </Modal>
  );
});
