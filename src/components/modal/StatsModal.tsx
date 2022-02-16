import React from "react";
import { Modal, Button, Text, Divider, HStack, VStack } from "native-base";

import { StatBar } from "../stats/StatBar";
import { Histgram } from "../stats/Histgram";
import { CountDown } from "../stats/CountDown";

import { GameStats } from "../../lib/localStorage";
import { tomorrow } from "../../lib/words";
import { shareStatus } from "../../lib/share";

interface Props {
  isOpen: boolean;
  onCloseStatsModal: () => void;
  gameStats: GameStats;
  guesses: string[];
  isGameLost: boolean;
  isGameWon: boolean;
  handleShare: () => void;
}

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

  return (
    <Modal isOpen={isOpen} onClose={onCloseStatsModal}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header
          _text={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: [18, 24],
          }}
        >
          成績
        </Modal.Header>
        <Modal.Body>
          <StatBar gameStats={gameStats} />
        </Modal.Body>
        <Modal.Header
          _text={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: [18, 24],
          }}
        >
          正解までの回答数
        </Modal.Header>
        <Modal.Body>
          <VStack space={5}>
            <Histgram gameStats={gameStats} />
            <Divider />
            {(isGameWon || isGameLost) && (
              <>
                <HStack justifyContent="space-around">
                  <VStack alignItems="center">
                    <Text fontSize={[12, 18]}>次の問題まで</Text>
                    <CountDown ms={tomorrow} />
                  </VStack>
                  <Button
                    onFocus={onPressShare}
                    w="40%"
                    _text={{ fontWeight: "bold", fontSize: [20, 28] }}
                  >
                    SHARE
                  </Button>
                </HStack>
              </>
            )}
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
});
