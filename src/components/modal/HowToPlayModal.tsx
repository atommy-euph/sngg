import { Modal, Text, Divider, HStack, useColorModeValue } from "native-base";
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

export function HowToPlayModal({ isOpen, onCloseHowToPlayModal }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onCloseHowToPlayModal}>
      <Modal.Content
        bg={useColorModeValue(lightBgColor, darkBgColor)}
        w={[300, 700]}
      >
        <Modal.CloseButton />
        <Modal.Header _text={{ fontWeight: "bold", fontSize: [14, 20] }}>
          遊び方
        </Modal.Header>
        <Modal.Body>
          <Text fontSize={[14, 20]} my={1}>
            {SIZE}文字の日本の駅・停留場の名前を{GUESS_MAX}
            回以内に当てるゲームです。
          </Text>
          <Text fontSize={[14, 20]} my={1}>
            回答する駅名は{SIZE}
            文字で実際に存在する(リストに含まれる)必要があります。
          </Text>
          <Text fontSize={[14, 20]}>
            入力後Enterを押すと、その回答と答えがどのくらい近いかによって、文字タイルの色が変わります。
          </Text>
          <Divider my={3} />
          <Text fontSize={[14, 20]} mb={3} bold>
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
          <Text pt={2} pb={4} fontSize={[14, 20]}>
            <Text fontSize={[14, 20]} pr={1} bold>
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
          <Text fontSize={[14, 20]} pt={2} pb={2}>
            <Text fontSize={[14, 20]} pr={1} bold>
              キ
            </Text>
            は答えに含まれているが位置は異なる。
          </Text>
          <Text fontSize={[14, 20]}>
            黒くなっている文字は答えに含まれません。
          </Text>
          <Divider my={3} />
          <Text fontSize={[14, 20]}>
            この場合、目的地は「
            <Text fontSize={[14, 20]} color={correctColor} px={1} bold>
              トウキョウ
            </Text>
            」と推測できます！
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}
