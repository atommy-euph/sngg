import React from "react";
import { HStack, Center } from "native-base";

import { Cell } from "./Cell";

import { SIZE } from "../../constants/settings";

export const EmptyRow = React.memo(function EmptyRow() {
  const emptyCells = Array.from(Array(SIZE));

  return (
    <Center>
      <HStack space={1}>
        {emptyCells.map((_, i) => (
          <Cell key={i} />
        ))}
      </HStack>
    </Center>
  );
});
