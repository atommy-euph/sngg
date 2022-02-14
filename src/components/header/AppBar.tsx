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
  // handleInfoModal: () => void
}

export const AppBar = React.memo(function AppBar({
  handleHowToPlayModal,
}: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleColorMode: any = (event: any) => {
    toggleColorMode();
    event.currentTarget.blur();
  };

  const onQuestionPressed: any = (event: any) => {
    handleHowToPlayModal();
    event.currentTarget.blur();
  };

  return (
    <HStack
      justifyContent="space-between"
      flexGrow={0}
      alignItems="center"
      px={4}
      w="100%"
      h={[60, 100]}
    >
      <HStack space={[0, 1]} alignItems="center" flexBasis="33.3%">
        <IconButton
          onFocus={onQuestionPressed}
          icon={<QuestionOutlineIcon size={[6, 8]} />}
        />
      </HStack>
      <Text fontSize={["24", "36"]} bold flexBasis="33.3%" textAlign="center">
        {GAME_TITLE}
      </Text>
      <HStack
        space={[0, 1]}
        alignItems="center"
        flexBasis="33.3%"
        flexDir="row-reverse"
      >
        <IconButton icon={<InfoIcon size={[6, 8]} />} />
        <IconButton
          onFocus={handleColorMode}
          icon={
            colorMode === "dark" ? (
              <SunIcon size={[6, 8]} />
            ) : (
              <MoonIcon size={[6, 8]} />
            )
          }
        />
      </HStack>
    </HStack>
  );
});
