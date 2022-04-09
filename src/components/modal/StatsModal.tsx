import React from "react";
import {
  Modal,
  Button,
  Text,
  Heading,
  Divider,
  HStack,
  VStack,
  Center,
  Square,
  Circle,
  Link,
  Image,
  Box,
} from "native-base";

import { StatBar } from "../stats/StatBar";
import { Histgram } from "../stats/Histgram";
import { CountDown } from "../stats/CountDown";

import { GameStats } from "../../lib/localStorage";
import {
  tomorrow,
  solution,
  solution_yesterday,
  solutionIndex,
} from "../../lib/words";
import { shareStatus } from "../../lib/share";
import { romanize } from "../../lib/kanaToRoman";

import { urls } from "../../constants/urls";
import { samegroupColor } from "../../constants/colors";

import BMC_BUTTON from "../../img/bmc-button.png";

interface Props {
  isOpen: boolean;
  onCloseStatsModal: () => void;
  gameStats: GameStats;
  guesses: string[];
  isGameLost: boolean;
  isGameWon: boolean;
  handleShare: () => void;
}

// const hogeStats: GameStats = {
//   winDistribution: [1, 3, 6, 12, 2, 4],
//   gamesFailed: 1,
//   currentStreak: 1,
//   bestStreak: 1,
//   totalGames: 1,
//   successRate: 1,
// };

export const StatsModal = React.memo(function StatsModal({
  isOpen,
  onCloseStatsModal,
  gameStats,
  guesses,
  isGameLost,
  isGameWon,
  handleShare,
}: Props) {
  const onPressShare: any = (event: any) => {
    shareStatus(guesses, isGameLost);
    handleShare();
    event.target.blur();
  };

  console.log(urls.JRアワジ);

  return (
    <Modal isOpen={isOpen} onClose={onCloseStatsModal}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header
          _text={{
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          成績
        </Modal.Header>
        <Modal.Body>
          <VStack space={5}>
            {(isGameWon || isGameLost) && (
              <>
                <Divider mt={2} />
                <Box bgColor="white" mb={4}>
                  <Square
                    w="100%"
                    h="12px"
                    mb={2}
                    bgColor={samegroupColor}
                  ></Square>
                  <VStack>
                    <Circle
                      position="absolute"
                      top="7px"
                      left="9%"
                      w="41px"
                      h="41px"
                      bgColor={samegroupColor}
                    >
                      <Circle
                        w="34px"
                        h="34px"
                        bgColor="white"
                        _text={{
                          fontWeight: "bold",
                          fontSize: 22,
                        }}
                      >
                        {solutionIndex}
                      </Circle>
                    </Circle>
                    <Heading
                      fontSize={26}
                      textAlign="center"
                      color="black"
                      letterSpacing={1}
                      mb={-1}
                    >
                      {solution}
                    </Heading>
                    <Heading
                      fontSize={18}
                      mb={3}
                      color="black"
                      textAlign="center"
                      letterSpacing={0.5}
                    >
                      {romanize(solution)}
                    </Heading>
                  </VStack>

                  <HStack justifyContent="space-between" px={1}>
                    <VStack opacity={0.5}>
                      <Heading
                        fontSize={18}
                        textAlign="left"
                        letterSpacing={0.5}
                        color="black"
                        mb={-0.5}
                      >
                        {solution_yesterday}
                      </Heading>
                      <Heading
                        fontSize={12}
                        textAlign="left"
                        ml={0.5}
                        letterSpacing={0.5}
                        color="black"
                      >
                        {romanize(solution_yesterday)}
                      </Heading>
                    </VStack>
                    <VStack>
                      <Circle
                        position="absolute"
                        right={0}
                        top={-33}
                        w="30px"
                        h="30px"
                        bgColor={samegroupColor}
                      >
                        <Circle
                          w="24px"
                          h="24px"
                          bgColor="white"
                          _text={{
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          {solutionIndex + 1}
                        </Circle>
                      </Circle>
                      <Text
                        position="absolute"
                        right={8}
                        top={-34}
                        fontWeight="bold"
                        fontSize={25}
                        color="black"
                      >
                        →
                      </Text>
                      <Heading
                        fontSize={18}
                        textAlign="right"
                        letterSpacing={0.5}
                        color="black"
                        mb={-0.5}
                      >
                        {"？？？？？"}
                      </Heading>
                      <Heading
                        fontSize={12}
                        textAlign="right"
                        letterSpacing={0.5}
                        color="black"
                        mr={0.5}
                      >
                        {"Next Station"}
                      </Heading>
                    </VStack>
                  </HStack>
                  <Square
                    w="100%"
                    h="14px"
                    mt={1}
                    bgColor={samegroupColor}
                  ></Square>
                </Box>
                <HStack justifyContent="center" space={3} flexWrap="wrap">
                  {urls[solution].map((value) => (
                    <Link
                      href={value["url"]}
                      isExternal
                      _text={{ color: "blue.400" }}
                    >
                      {value["title"]}
                    </Link>
                  ))}
                </HStack>
              </>
            )}
            <Divider />

            <StatBar gameStats={gameStats} />
            <Divider />
            <Heading fontSize={18}>正解までの回答数</Heading>
            <Histgram gameStats={gameStats} />

            {(isGameWon || isGameLost) && (
              <>
                <Divider mt={2} mb={4} />

                <HStack justifyContent="space-around">
                  <VStack alignItems="center">
                    <Text fontSize={12}>NEXT STATION</Text>
                    <CountDown ms={tomorrow} />
                  </VStack>
                  <Button
                    onFocus={onPressShare}
                    w="40%"
                    _text={{ fontWeight: "bold", fontSize: 20 }}
                  >
                    SHARE
                  </Button>
                </HStack>
              </>
            )}
            <Divider mb={2} />
            <Center mb={4}>
              <Link href="https://buymeacoffee.com/atommy" isExternal>
                <Image
                  source={BMC_BUTTON}
                  alt="Buy me a coffee"
                  minW={150}
                  minH={10}
                />
              </Link>
            </Center>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
});
