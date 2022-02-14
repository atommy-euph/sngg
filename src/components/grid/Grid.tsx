import { VStack, Center } from "native-base";

import { GUESS_MAX } from "../../constants/settings";

import { CompletedRow } from "./CompletedRow";
import { CurrentRow } from "./CurrentRow";
import { EmptyRow } from "./EmptyRow";

interface Props {
  guesses: string[];
  currentGuess: string;
}

export function Grid({ guesses, currentGuess }: Props) {
  const empties =
    guesses.length < GUESS_MAX - 1
      ? Array.from(Array(GUESS_MAX - 1 - guesses.length))
      : [];

  return (
    <Center flex={1}>
      <VStack space={1} justifyContent="center">
        {guesses.map((guess, i) => (
          <CompletedRow key={i} guess={guess} />
        ))}
        {guesses.length < GUESS_MAX && <CurrentRow guess={currentGuess} />}
        {empties.map((_, i) => (
          <EmptyRow key={i} />
        ))}
      </VStack>
    </Center>
  );
}
