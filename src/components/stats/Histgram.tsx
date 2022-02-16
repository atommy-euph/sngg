import { Center, Circle, HStack, Box, VStack, Text } from "native-base";

import { GameStats } from "../../lib/localStorage";
import { barColors } from "../../constants/colors"; //max 10

type Props = {
  gameStats: GameStats;
};

export function Histgram({ gameStats }: Props) {
  const sum = gameStats.winDistribution.reduce((sum, item) => sum + item, 0);
  const max_freq = Math.max(...gameStats.winDistribution)
    ? Math.max(...gameStats.winDistribution)
    : 1;

  return (
    <Center>
      <HStack w="100%" pl={3} pr={5}>
        <VStack flexGrow={1} space={4} alignItems="space-around" w="50%">
          {gameStats.winDistribution.map((value, index) => (
            <ProgressBar
              key={index}
              freq={value}
              sum={sum}
              max_freq={max_freq}
              color={barColors[index]}
              label={index + 1}
            />
          ))}
        </VStack>
      </HStack>
    </Center>
  );
}

function ProgressBar({
  freq,
  sum,
  max_freq,
  color,
  label,
}: {
  freq: number;
  sum: number;
  max_freq?: number;
  color?: string;
  label: string | number;
}) {
  const max = max_freq ? max_freq : 1;
  const width = max_freq ? (freq / max_freq) * 100 : (freq / sum) * 100; //%
  const barHeight = 4; //px
  const borderWidth = 4; //px
  const boxSize = 19; //px
  const circleSize = 14;
  const boxTop = (-1 * (boxSize - barHeight)) / 2;
  const circleTop = (-1 * (circleSize - barHeight)) / 2;
  const circleLeft = 100 / freq; //%

  const p = 20 / sum;
  let isCircleExists: number[] = [];
  for (let i = 0; i < freq; i++) {
    // 値が０から１までの
    isCircleExists.push(Math.random());
  }

  return (
    <Box
      position="relative"
      top={2}
      h={`${barHeight}px`}
      w={`${width}%`}
      bgColor={color ? color : "amber.300"}
    >
      <Text position="absolute" top={-9} left={-12} bold italic>
        {label}
      </Text>
      {max > 1 ? (
        [...Array(freq > 0 ? freq - 1 : 0)].map((_, i) => (
          <>
            {isCircleExists[i] < p ? (
              <Circle
                key={i}
                bgColor="gray.50"
                borderColor={color}
                borderWidth={`${borderWidth}px`}
                position="absolute"
                left={`${circleLeft * (i + 1)}%`}
                size={`${circleSize}px`}
                top={`${circleTop}px`}
              />
            ) : (
              <Circle
                key={i}
                bgColor="gray.900.alpha.1"
                position="absolute"
                left={`${circleLeft * (i + 1)}%`}
                size={`${circleSize}px`}
                top={`${circleTop}px`}
              />
            )}
          </>
        ))
      ) : (
        <Circle
          bgColor="gray.50"
          borderColor={color}
          borderWidth={`${borderWidth}px`}
          left={`${circleLeft / 2}%`}
          size={`${circleSize}px`}
          top={`${circleTop}px`}
        />
      )}
      <Center
        bgColor="gray.50"
        borderColor={color}
        borderWidth={`${borderWidth}px`}
        borderRadius={3}
        position="absolute"
        size={`${boxSize}px`}
        right={`${-1 * boxSize}px`}
        top={`${boxTop}px`}
        _text={{
          fontWeight: "bold",
          color: "gray.900",
          textAlign: "center",
          fontSize: 12,
        }}
      >
        {freq}
      </Center>
    </Box>
  );
}
