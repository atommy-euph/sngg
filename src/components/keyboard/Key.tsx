import React, { ReactNode } from "react";
import { Button, Text, useColorMode } from "native-base";

import { CharStatus, getColors } from "../../lib/statuses";
import {
  lightKeyColor,
  darkKeyColor,
  lightTextColor,
  darkTextColor,
} from "../../constants/colors";

interface Props {
  children?: ReactNode;
  value: string;
  status?: CharStatus;
  onClick: (value: string) => void;
}

export const Key = React.memo(function Key({
  children,
  value,
  status,
  onClick,
}: Props) {
  const { colorMode } = useColorMode();
  const keySize = 7.9; //vw
  const keyConfig = {
    w:
      value === "enter" || value === "delete" || value === "toggle"
        ? `${keySize * 2.1}vw`
        : `${keySize}vw`,
    h: `${keySize}vw`,
    maxW:
      value === "enter" || value === "delete" || value === "toggle"
        ? "73px"
        : "35px",
    maxH:
      value === "enter" || value === "delete" || value === "toggle"
        ? "35px"
        : "35px",
    color: status
      ? getColors(status, colorMode).keyColor
      : colorMode === "light"
      ? lightKeyColor
      : darkKeyColor,
    fontSize:
      value === "enter" || value === "delete" || value === "toggle"
        ? "xs"
        : "md",
  };

  const handleClick: any = (event: any) => {
    onClick(value);
    event.currentTarget.blur();
  };

  return (
    <Button
      bg={keyConfig.color}
      key={value}
      w={keyConfig.w}
      h={keyConfig.h}
      maxW={keyConfig.maxW}
      maxH={keyConfig.maxH}
      _hover={{ bg: keyConfig.color }}
      _focus={{ bg: keyConfig.color }}
      _pressed={{ bg: keyConfig.color }}
      onFocus={handleClick}
    >
      <Text
        color={
          colorMode === "light"
            ? status
              ? lightTextColor
              : darkTextColor
            : lightTextColor
        }
        fontSize={keyConfig.fontSize}
        bold
      >
        {children || value}
      </Text>
    </Button>
  );
});
