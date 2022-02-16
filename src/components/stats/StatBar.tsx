import { HStack, VStack, Text } from "native-base";

import { GameStats } from "../../lib/localStorage";

type Props = {
  gameStats: GameStats;
};

export function StatBar({ gameStats }: Props) {
  return (
    <HStack justifyContent="space-around">
      <StatItem label="Played" value={gameStats.totalGames} />
      <StatItem label={"Success\nRate"} value={gameStats.successRate} />
      <StatItem label={"Current\nStreak"} value={gameStats.currentStreak} />
      <StatItem label={"Max\nStreak"} value={gameStats.bestStreak} />
    </HStack>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <VStack space={-5} alignItems="center">
      <Text fontSize={28} bold>
        {value}
      </Text>
      <Text fontSize={12} lineHeight={12} textAlign="center">
        {label}
      </Text>
    </VStack>
  );
}
