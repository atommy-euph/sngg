import {
  Modal,
  Text,
  Button,
  Divider,
  HStack,
  useColorModeValue,
  VStack,
} from "native-base";

import { StatBar } from "../stats/StatBar";
import { Histgram } from "../stats/Histgram";

import { GameStats } from "../../lib/localStorage";

const hogeStats: GameStats = {
  winDistribution: [1, 3, 3, 4, 6, 2],
  gamesFailed: 2,
  currentStreak: 4,
  bestStreak: 7,
  totalGames: 23,
  successRate: (21 / 23) * 100,
};

interface Props {
  isOpen: boolean;
  onCloseStatsModal: () => void;
}

export function StatsModal({ isOpen, onCloseStatsModal }: Props) {
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
          <StatBar />
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
            <Histgram gameStats={hogeStats} />
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
}
