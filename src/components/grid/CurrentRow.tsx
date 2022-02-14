import { HStack, Center } from "native-base";

import { Cell } from "./Cell";

import { SIZE } from "../../constants/settings";

interface Props {
  guess: string;
}

export function CurrentRow({ guess }: Props) {
  const splitGuess = guess.split("");
  const emptyCells = Array.from(Array(SIZE - splitGuess.length));

  return (
    <Center>
      <HStack space={1}>
        {splitGuess.map((letter, i) => (
          <Cell key={i} value={letter} />
        ))}
        {emptyCells.map((_, i) => (
          <Cell key={i} />
        ))}
      </HStack>
    </Center>
  );
}
