import React from "react";
import { Square, useColorMode } from "native-base";

import { CharStatus, getColors } from "../../lib/statuses";
import {
  darkTextColor,
  lightBorderColor,
  darkBorderColor,
  lightInputBorderColor,
  darkInputBorderColor,
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
    ? getColors(status, colorMode)
    : {
        bgColor: "None",
        borderColor: value
          ? colorMode === "light"
            ? lightInputBorderColor
            : darkInputBorderColor
          : colorMode === "light"
          ? lightBorderColor
          : darkBorderColor,
      };
  const cellSize = "7vh";
  const cellMaxSize = "55px";
  const cellMinSize = "40px";
  const fontSize = "2xl";

  return (
    <Square
      bg={bgColor}
      p={3}
      borderWidth={3}
      borderColor={borderColor}
      size={cellSize}
      minW={cellMinSize}
      minH={cellMinSize}
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
