import React from "react";
import { HStack, Center } from "native-base";

import { Cell } from "./Cell";

import { getGuessStatuses } from "../../lib/statuses";

interface Props {
  guess: string;
}

export const CompletedRow = React.memo(function CompletedRow({ guess }: Props) {
  const statues = getGuessStatuses(guess);

  return (
    <Center>
      <HStack space={1}>
        {guess.split("").map((letter, i) => (
          <Cell value={letter} key={i} status={statues[i]} isCompleted={true} />
        ))}
      </HStack>
    </Center>
  );
});
