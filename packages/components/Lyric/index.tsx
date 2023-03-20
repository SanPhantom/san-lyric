import { findLastIndex } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import "./lyric.less";

export type LyricItemType = {
  lyric: string;
  t_lyric?: string;
  time: number;
};

const sports = {
  linear: (t: number, b: number, c: number, d: number) => {
    return (c * t) / d + b;
  },
};

interface ILyricProps {
  fps?: number;
  lyrics: LyricItemType[];
  currentTime: number;
  duration: number;
  selectColor?: string;
  color?: string;
  selectBgColor?: string;
}

const Lyric = ({
  fps,
  lyrics,
  currentTime,
  duration,
  selectBgColor = "transparent",
  color,
  selectColor,
}: ILyricProps) => {
  const [current, setCurrent] = useState<number>(0);
  const lyricRootRef = useRef<HTMLDivElement | null>(null);

  // 滚动的高度
  const scrollHeight = useRef<number>(0);
  // 滚动是否锁住
  const scrollLock = useRef<boolean>(false);
  // 动画
  const animationRef = useRef<number | null>(null);
  const durationRef = useRef(((fps ?? 0) * 70) / 160);
  // 歌词数据
  const lyricDataRef = useRef(lyrics);

  const scrollRef = useRef(0);
  const delayRef = useRef<number | null>(null);

  const startRef = useRef<number>(0);

  // 获取当前歌词的行数位置
  const getLyricCurrentLine = useCallback(() => {
    if (
      lyricDataRef.current.length > 0 &&
      duration !== 0 &&
      currentTime <= duration
    ) {
      const nodeIndex = findLastIndex(
        lyricDataRef.current,
        (lyric) => lyric.time < currentTime
      );
      return Promise.resolve(nodeIndex);
    }
    return Promise.resolve(0);
  }, [duration, currentTime]);

  // 关闭滚动动画
  const clearScrollAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      scrollLock.current = false;
      scrollHeight.current = 0;
      startRef.current = 0;
    }
  }, []);

  // 歌词滚动动画
  const runLyricScroll = useCallback(() => {
    if (lyricRootRef.current) {
      scrollLock.current = true;
      startRef.current++;
      const top = sports.linear(
        startRef.current,
        scrollRef.current,
        scrollHeight.current,
        durationRef.current
      );
      lyricRootRef.current.scrollTop = top;
      if (startRef.current <= durationRef.current) {
        animationRef.current = requestAnimationFrame(runLyricScroll);
      } else {
        scrollRef.current = top;
        clearScrollAnimation();
      }
    }
  }, [clearScrollAnimation]);

  const getScrollHeight = useCallback(
    (index: number) => {
      if (
        lyricRootRef.current?.children &&
        lyricRootRef.current?.children.length > 0
      ) {
        const firstNode: HTMLDivElement = lyricRootRef.current
          .children[0] as HTMLDivElement;
        const childNode: HTMLDivElement = lyricRootRef.current.children[
          index
        ] as HTMLDivElement;
        if (childNode) {
          const sumTop = childNode.offsetTop - firstNode.offsetTop;
          scrollHeight.current = sumTop - scrollRef.current;
        }
      }
      if (!scrollLock.current && animationRef.current === null) {
        animationRef.current = requestAnimationFrame(runLyricScroll);
      }
    },
    [runLyricScroll]
  );

  const delayBackCurrent = useCallback(() => {
    const clearTimerRef = () => {
      if (delayRef.current) {
        clearTimeout(delayRef.current);
        delayRef.current = null;
      }
    };
    clearTimerRef();
    delayRef.current = window.setTimeout(() => {
      if (lyricRootRef.current) {
        scrollRef.current = lyricRootRef.current.scrollTop;
        scrollLock.current = false;
      }
      getLyricCurrentLine().then((index) => {
        clearScrollAnimation();
        getScrollHeight(index);
        clearTimerRef();
      });
    }, 3000);
  }, [clearScrollAnimation, getLyricCurrentLine, getScrollHeight]);

  // 手指滑动事件
  const handleTouchMove = () => {
    // 锁住歌词自动滚动
    scrollLock.current = true;
  };

  useEffect(() => {
    // 歌词更新后初始化数据
    setCurrent(0);
    scrollRef.current = 0;
    lyricDataRef.current = lyrics;
  }, [lyrics]);

  useEffect(() => {
    getLyricCurrentLine().then((index) => {
      setCurrent(index);
      if (index !== current) {
        getScrollHeight(index);
      }
    });
  }, [current, getLyricCurrentLine, getScrollHeight]);

  useEffect(() => {
    if (fps) {
      durationRef.current = Math.ceil((fps * 70) / 120);
    }
  }, [fps]);

  useEffect(() => {
    if (lyricRootRef.current) {
      lyricRootRef.current.addEventListener("mousewheel", () => {
        scrollLock.current = true;
        delayBackCurrent();
      });
      // 手动滚动存在问题
      lyricRootRef.current.addEventListener("touchstart", () => {
        scrollLock.current = true;
        lyricRootRef.current?.addEventListener("touchmove", handleTouchMove);
      });
      lyricRootRef.current.addEventListener("touchend", () => {
        delayBackCurrent();
        lyricRootRef.current?.removeEventListener("touchmove", handleTouchMove);
      });
    }
  }, [delayBackCurrent]);

  return (
    <div className="lyric-root" ref={lyricRootRef}>
      {lyrics.map((item, index) => (
        <div
          className={`lyric ${current === index && "active"}`}
          style={{
            color: current === index ? selectColor : color,
            backgroundColor: current === index ? selectBgColor : undefined,
          }}
          key={item.time}
        >
          <p className="lyric-item">{item.lyric}</p>
          <p className="t-lyric-item">{item.t_lyric}</p>
        </div>
      ))}
    </div>
  );
};

export default Lyric;
