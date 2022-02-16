import React from "react";
import {
  HStack,
  IconButton,
  Text,
  InfoIcon,
  QuestionOutlineIcon,
  MoonIcon,
  SunIcon,
  useColorMode,
} from "native-base";

import { GAME_TITLE } from "../../constants/settings";

interface Props {
  handleHowToPlayModal: () => void;
  handleInfoModal: () => void;
}

export const AppBar = React.memo(function AppBar({
  handleHowToPlayModal,
  handleInfoModal,
}: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  const onQuestionPressed: any = (event: any) => {
    handleHowToPlayModal();
    event.currentTarget.blur();
  };
  const handleColorMode: any = (event: any) => {
    toggleColorMode();
    localStorage.setItem("theme", colorMode === "dark" ? "light" : "dark");
    event.currentTarget.blur();
  };
  const onInfoPressed: any = (event: any) => {
    handleInfoModal();
    event.currentTarget.blur();
  };

  return (
    <HStack
      justifyContent="space-between"
      flexGrow={0}
      alignItems="center"
      px={4}
      w="100%"
      h={60}
    >
      <HStack space={[0, 1]} alignItems="center" flexBasis="33.3%">
        <IconButton
          onFocus={onQuestionPressed}
          icon={<QuestionOutlineIcon size={6} />}
        />
      </HStack>
      <Text fontSize={24} bold flexBasis="33.3%" textAlign="center">
        {GAME_TITLE}
      </Text>
      <HStack
        space={[0, 1]}
        alignItems="center"
        flexBasis="33.3%"
        flexDir="row-reverse"
      >
        <IconButton onFocus={onInfoPressed} icon={<InfoIcon size={6} />} />
        <IconButton
          onFocus={handleColorMode}
          icon={
            colorMode === "dark" ? <SunIcon size={6} /> : <MoonIcon size={6} />
          }
        />
      </HStack>
    </HStack>
  );
});
