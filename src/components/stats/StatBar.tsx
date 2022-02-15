import { HStack, VStack, Text } from "native-base";

export function StatBar() {
  return (
    <HStack justifyContent="space-around">
      <StatItem label="Played" value={1} />
      <StatItem label={"Success\nRate"} value={1} />
      <StatItem label={"Current\nStreak"} value={1} />
      <StatItem label={"Max\nStreak"} value={1} />
    </HStack>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <VStack space={-5} alignItems="center">
      <Text fontSize={[28, 34]} bold>
        {value}
      </Text>
      <Text fontSize={[12, 15]} lineHeight={[12, 15]} textAlign="center">
        {label}
      </Text>
    </VStack>
  );
}
