/**
 * 时间转换为时间戳
 * @param time 时间字符串 (Min.Sec.Milliseconds） ==> 02.12.999
 * @returns
 */
export const time2Timestamp = (time: string) => {
  const pattern = /(.+):(.+)\.(.+)/;
  const times: RegExpMatchArray | null = time.match(pattern);
  return (
    (Number(times?.[1]) * 60 + Number(times?.[2])) * 1000 +
    Number(times?.[3])
  ).toString();
};
