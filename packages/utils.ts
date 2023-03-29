import { defaultsDeep, values } from "lodash";
import { LyricItemType } from "./components/Lyric";
import { getLyricData } from "./utils/lyric";

/**
 * 数组最后一位开始删除
 * @param arr 字符串数组
 * @param num 删除位数
 * @returns 新数组
 */
export const deleteLast = (arr: Array<string>, num: number = 1) => {
  const new_arr = arr.concat();
  for (let i = 0; i < num; i++) {
    new_arr.pop();
  }
  return new_arr;
};

/**
 * @param {number} targetCount 不小于1的整数，表示经过targetCount帧之后返回结果
 * @return {Promise<number>}
 */
export const getScreenFps = (() => {
  // 先做一下兼容性处理
  const nextFrame = [window.requestAnimationFrame].find((fn) => fn);
  if (!nextFrame) {
    console.error("requestAnimationFrame is not supported!");
    return;
  }
  return (targetCount = 100) => {
    // 判断参数是否合规
    if (targetCount < 1) throw new Error("targetCount cannot be less than 1.");
    const beginDate = Date.now();
    let count = 0;
    return new Promise<number>((resolve) => {
      (function log() {
        nextFrame(() => {
          if (++count >= targetCount) {
            const diffDate = Date.now() - beginDate;
            const fps = (count / diffDate) * 1000;
            return resolve(fps);
          }
          log();
        });
      })();
    });
  };
})();

/**
 * 格式化歌词
 * @param lyric 原文歌词
 * @param tLyric 翻译歌词
 */
export const formatLyric = (lyric: string, tLyric: string): LyricItemType[] => {
  const lyricData = getLyricData(deleteLast(lyric.split(/\n/)));
  const tLyricData = getLyricData(deleteLast(tLyric.split(/\n/)), "t_lyric");

  return values(defaultsDeep(lyricData, tLyricData));
};
