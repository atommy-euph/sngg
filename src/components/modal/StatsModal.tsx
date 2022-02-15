import React from "react";
import { Modal, Text, Button, Divider, HStack, VStack } from "native-base";

import { StatBar } from "../stats/StatBar";
import { Histgram } from "../stats/Histgram";

import { GameStats } from "../../lib/localStorage";

interface Props {
  isOpen: boolean;
  onCloseStatsModal: () => void;
  gameStats: GameStats;
}

export const StatsModal = React.memo(function StatsModal({
  isOpen,
  onCloseStatsModal,
  gameStats,
}: Props) {
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
            <HStack justifyContent="space-around">
              <VStack alignItems="center">
                <Text fontSize={[12, 18]}>次の問題まで</Text>
                <Text fontSize={[24, 38]}>13:14:22</Text>
              </VStack>
              <Button />
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
});
