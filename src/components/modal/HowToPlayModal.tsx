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
  samegroupColor,
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
            回以内に当てるゲームです。1日1問、新しい問題が出題されます。
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
            5文字の例 ( 答「
            <Text fontSize={14} mb={3} color={correctColor} bold>
              アキハバラ
            </Text>
            」)
          </Text>
          <HStack space={1}>
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="J"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="R"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="オ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="グ"
            />
            <CellDemo
              cellSize={9}
              borderColor={correctColor}
              bgColor={correctColor}
              fontSize={22}
              color={lightTextColor}
              value="ラ"
            />
          </HStack>
          <Text pt={2} pb={4} fontSize={14}>
            <Text color={correctColor} fontSize={14} pr={1} bold>
              ラ
            </Text>
            は答えに含まれており、位置も正しいです。また、黒くなっている文字は答えに含まれません。
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
              value="ト"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
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
              value="ワ"
            />
          </HStack>
          <Text pt={2} pb={4} fontSize={14}>
            <Text color={presentColor} fontSize={14} pr={1} bold>
              キ
            </Text>
            は答えに含まれていますが位置は異なります。さらに2文字目の
            <Text color={presentColor} fontSize={14} pr={1} bold>
              キ
            </Text>
            がグレーであることからは2文字以上含まれないとわかります。
          </Text>
          <HStack space={1}>
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
              borderColor={presentColor}
              bgColor={presentColor}
              fontSize={22}
              color={lightTextColor}
              value="ハ"
            />
            <CellDemo
              cellSize={9}
              borderColor={samegroupColor}
              bgColor={samegroupColor}
              fontSize={22}
              color={lightTextColor}
              value="ギ"
            />
            <CellDemo
              cellSize={9}
              borderColor={correctColor}
              bgColor={correctColor}
              fontSize={22}
              color={lightTextColor}
              value="バ"
            />
            <CellDemo
              cellSize={9}
              borderColor={absentColor}
              bgColor={absentColor}
              fontSize={22}
              color={lightTextColor}
              value="シ"
            />
          </HStack>
          <Text pt={2} pb={4} fontSize={14}>
            <Text color={samegroupColor} fontSize={14} pr={1} bold>
              ギ
            </Text>
            は答えに含まれていませんが。
            <Text color={presentColor} fontSize={14} px={1} bold>
              キ
            </Text>
            は答えに含まれています。 このように「ヤ, ャ」「ハ, バ, パ」「ツ, ヅ,
            ッ」など、同じ形を持つカナが答えに含まれる場合、位置によらず
            <Text color={samegroupColor}>紫</Text>
            で表示されます。
          </Text>

          <Divider my={3} />

          <Heading {...headingProps}>ルール</Heading>

          <Text {...textProps}>
            ・「駅」「停留場」は文字数に含みません。5文字の場合「シブヤエキ」は解答できません。
          </Text>
          <Text {...textProps}>
            ・アルファベットや数字など、表記と読み方が異なる場合は表記を優先します。例:「JRアワジ」
          </Text>
          <Text {...textProps}>
            ・駅名に含まれる中黒、括弧は除きます。例:「栂・美木多」→「トガミキタ」
          </Text>
          <Text>
            ・駅名及びその読みは、
            <Link
              href="https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E9%89%84%E9%81%93%E9%A7%85%E4%B8%80%E8%A6%A7"
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
          <Text color="gray.400" textAlign="center">
            Contact:{" "}
            <Link
              href="mailto:mt.rich.new@gmail.com"
              isExternal
              _text={{ color: "gray.400" }}
            >
              mt.rich.new@gmail.com
            </Link>
            .
          </Text>
        </Modal.Body>
      </Modal.Content>
      で
    </Modal>
  );
});
