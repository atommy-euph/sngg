import React, { ReactNode } from "react";
import { Button, Text } from "native-base";

import { CharStatus, getColors } from "../../lib/statuses";
import { defaultKeyColor, lightTextColor } from "../../constants/colors";

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
  const keyConfig = {
    w:
      value === "enter" || value === "delete" || value === "toggle"
        ? [70, 70, 90, 117]
        : [28, 35, 42, 55],
    h:
      value === "enter" || value === "delete" || value === "toggle"
        ? [28, 35, 45, 55]
        : [28, 35, 42, 55],
    color: status ? getColors(status).keyColor : defaultKeyColor,
    fontSize:
      value === "enter" || value === "delete" || value === "toggle"
        ? ["xs", "sm", "md", "md"]
        : ["md", "lg", "xl", "2xl"],
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
      _hover={{ bg: keyConfig.color }}
      _focus={{ bg: keyConfig.color }}
      _pressed={{ bg: keyConfig.color }}
      onFocus={handleClick}
    >
      <Text color={lightTextColor} fontSize={keyConfig.fontSize} bold>
        {children || value}
      </Text>
    </Button>
  );
});
