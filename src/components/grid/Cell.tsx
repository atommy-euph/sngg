import React from "react";
import { Square, useColorMode } from "native-base";

import { CharStatus, getColors } from "../../lib/statuses";
import {
  darkTextColor,
  defaultBorderColor,
  lightTextColor,
} from "../../constants/colors";

interface Props {
  value?: string;
  status?: CharStatus;
  isCompleted?: boolean;
}

export const Cell = React.memo(function Cell({
  value,
  status,
  isCompleted,
}: Props) {
  const { colorMode } = useColorMode();
  const { bgColor, borderColor } = status
    ? getColors(status)
    : { bgColor: "None", borderColor: defaultBorderColor };
  const cellSize = ["13vw", "10vw"];
  const cellMaxSize = ["55px", "62px"];
  const fontSize = ["2xl", "3xl", "4xl", "4xl"];

  return (
    <Square
      bg={bgColor}
      p={3}
      borderWidth={3}
      borderColor={borderColor}
      w={cellSize}
      h={cellSize}
      maxW={cellMaxSize}
      maxH={cellMaxSize}
      _text={{
        color:
          !isCompleted && colorMode === "light"
            ? darkTextColor
            : lightTextColor,
        fontSize: fontSize,
        fontWeight: "bold",
      }}
    >
      {value}
    </Square>
  );
});

export const CellDemo = React.memo(function CellDemo(props: any) {
  return (
    <Square
      bg={props.bgColor}
      p={3}
      borderWidth={3}
      borderColor={props.borderColor}
      w={props.cellSize}
      h={props.cellSize}
      _text={{
        color: props.color,
        fontSize: props.fontSize,
        fontWeight: "bold",
      }}
    >
      {props.value}
    </Square>
  );
});
