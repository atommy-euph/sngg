import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";
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
  const [styles, setStyles] = useSpring(() => ({
    transform: "scale(1.0)",
  }));
  useEffect(() => {
    if (value) {
      setStyles({ transform: "scale(1.3)" });
      setTimeout(() => {
        setStyles({ transform: "scale(1.0)" });
      }, 50);
    }
  }, [setStyles, value]);

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
    <animated.div style={styles}>
      <div
        className={`flex justify-center items-center border-2 w-14 h-14 ${bgColor} ${borderColor}`}
        // size={cellSize}
        // minW={cellMinSize}
        // minH={cellMinSize}
        // maxW={cellMaxSize}
        // maxH={cellMaxSize}
      >
        <p className="font-bold text-3xl pb-1 text-darkTextColor dark:text-lightTextColor">
          {value}
        </p>
      </div>
    </animated.div>
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
