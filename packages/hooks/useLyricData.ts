import { formatLyric } from "@/utils";
import { useMemo } from "react";

const useLyricData = (lyric: string, tLyric: string) => {
  const lyricData = useMemo(() => {
    return formatLyric(lyric, tLyric);
  }, [lyric, tLyric]);

  return lyricData;
};

export default useLyricData;
