# san-lyric

```shell
 npm install san-lyric --save
```

## 1. Methods(方法)

### `getScreenFps` ----> 获取屏幕刷新率

> 在 `App.tsx` 中调用获取 fps 并进行保存，方便后续调用。

```js
getScreenFps?.().then((fps: number) => {
  console.log("当前屏幕刷新率为", fps);
  // todo code
});
```

## 2. Components(组件)

### `Lyric` ----> 歌词显示组件

展示歌词的组件

#### Props

| Name          | Desc                        | Type              | Default | Required |
| ------------- | --------------------------- | ----------------- | ------- | -------- |
| `lyrics`      | 歌词数据 a                  | `LyricItemType[]` | []      | `true`   |
| `currentTime` | 歌曲播放当前进度 `ms毫秒级` | `number`          | 0       | `true`   |
| `duration`    | 歌曲总时长 `ms毫秒级`       | `number`          | 0       | `true`   |
| `fps`         | 屏幕刷新率                  | `number`          | 0       | `true`   |

## 3. Type(类型)

### `LyricItemType`

| Name      | Desc               | Type     | Default | Required |
| --------- | ------------------ | -------- | ------- | -------- |
| `lyric`   | 原文歌词           | `string` |         | `true`   |
| `t_lyric` | 译文歌词           | `string` |         | `true`   |
| `time`    | 展示当前歌词的时间 | `number` | 0       | `true`   |
