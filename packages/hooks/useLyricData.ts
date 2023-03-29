import { formatLyric } from "@/utils";
import { isEmpty } from "lodash";
import { useMemo } from "react";

const useLyricData = (lyric: string, tLyric: string) => {
  const lyricData = useMemo(() => {
    if (isEmpty(lyric)) {
      return [];
    }
    return formatLyric(lyric, tLyric);
  }, [lyric, tLyric]);

  return lyricData;
};

export default useLyricData;
