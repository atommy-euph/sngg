import { useState, useEffect } from "react";
import { Text } from "native-base";

interface Props {
  ms: number;
}

export function CountDown({ ms }: Props) {
  const [sec, setSec] = useState(ms / 1000);

  useEffect(() => {
    sec > 0 && setTimeout(() => setSec(sec - 1), 1000);
  }, [sec]);

  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((sec / 60) % 60)
    .toString()
    .padStart(2, "0");
  const h = Math.floor((sec / 60 / 60) % 24)
    .toString()
    .padStart(2, "0");
  return (
    <Text fontWeight="bold" fontSize={22}>
      {h}:{m}:{s}
    </Text>
  );
}
