import { formatLyric } from "@/utils";
import { isEmpty } from "lodash";
import { useMemo } from "react";

const useLyricData = (lyric: string, tLyric: string) => {
  const lyricData = useMemo(() => {
    console.log(isEmpty(lyric));
    if (isEmpty(lyric) || isEmpty(tLyric)) {
      return [];
    }
    return formatLyric(lyric, tLyric);
  }, [lyric, tLyric]);

  return lyricData;
};

export default useLyricData;
