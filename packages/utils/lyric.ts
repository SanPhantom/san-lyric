import { time2Timestamp } from "./time";

/**
 * 判断是否跳过歌词数据
 * @param str
 * @returns
 */
export const judgeLyric = (str: string) => {
  if (str.startsWith("[ti:")) {
    return false;
  }
  if (str.startsWith("[ar:")) {
    return false;
  }
  if (str.startsWith("[al:")) {
    return false;
  }
  if (str.startsWith("[by:")) {
    return false;
  }
  return true;
};

/**
 * 生成歌词的数据
 * @param arr 带有时间的歌词字符串数据
 * @param lKey 返回的key
 * @returns 歌词数据
 */
export const getLyricData = (arr: Array<string>, lKey: string = "lyric") => {
  let lData: { [x: string]: { [x: string]: string | number; time: number } } =
    {};
  arr.forEach((item) => {
    if (judgeLyric(item)) {
      let pattern = /\[(.+)\](.+)?/;
      let data = item.match(pattern);
      if (data?.[1]) {
        const time = time2Timestamp(data?.[1]);
        lData[time] = {
          time: Number(time),
          [lKey]: data?.[2] ?? "",
        };
      }
    }
  });
  return lData;
};
