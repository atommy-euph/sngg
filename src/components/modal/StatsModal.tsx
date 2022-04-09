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
  Link,
  Image,
} from "native-base";

import { StatBar } from "../stats/StatBar";
import { Histgram } from "../stats/Histgram";
import { CountDown } from "../stats/CountDown";

import { GameStats } from "../../lib/localStorage";
import { tomorrow, solution } from "../../lib/words";
import { shareStatus } from "../../lib/share";

import { correctColor } from "../../constants/colors";
import { urls } from "../../constants/urls";

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
            <StatBar gameStats={gameStats} />
            <Divider />
            <Heading fontSize={18}>正解までの回答数</Heading>
            <Histgram gameStats={gameStats} />
            <Divider mt={2} />
            {(isGameWon || isGameLost) && (
              <>
                <Heading fontSize={14} mb={1} textAlign="center">
                  今日の目的地
                </Heading>
                <Heading
                  fontSize={18}
                  mb={2}
                  textAlign="center"
                  color={correctColor}
                >
                  {solution}
                </Heading>
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

                <Divider my={4} />

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
                <Divider mt={4} mb={2} />
              </>
            )}
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
