/* rollup.config.js */
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import eslint from '@rollup/plugin-eslint';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'rollup';
import less from 'less';

// 环境变量

const entry = 'packages/main.ts'
const urilsEntry = 'packages/utils.ts'
const componentsDir = 'packages/components'
const componentsName = fs.readdirSync(path.resolve(componentsDir))
const componentsEntry = componentsName.map(
  (name) => `${componentsDir}/${name}/index.tsx`
)

console.log(componentsEntry)

// ES Module打包输出
const esmOutput = {
  preserveModules: true,
  // preserveModulesRoot: 'packages',
  // exports: 'named',
  assetFileNames: ({ name }) => {
    const { ext, dir, base } = path.parse(name);
    console.log({ ext, dir, base })
    if (ext !== '.css' && ext !== '.less') return '[name].[ext]';
    return path.join(dir, 'style', base);
  }
}

const processLess = function (context) {
  return new Promise((resolve, reject) => {
    less.render({
      file: context
    }, function (err, result) {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
    });

    less.render(context, {})
      .then(function (output) {
        if (output && output.css) {
          resolve(output.css);
        } else {
          reject({})
        }
      }, function (err) {
        reject(err);
      })
  })
}

const commonPlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  terser(),
  eslint(),
  babel({ exclude: 'node_modules/**' }),
  postcss({
    extract: true,
    minimize: true,
    process: processLess
  })
]

// 忽略文件
const externalConfig = [
  id => /\/__expample__|main.tsx/.test(id), // 组件的本地测试文件，不希望被打包。
  'react',
  'react-dom',
  '@types/react',
  '@types/react-dom',
  'classname',
  'react-is',
  'lodash',
  '@types/lodash',
  '**/node_modules/**'
];

export default defineConfig([{
  input: [entry, urilsEntry, ...componentsEntry],
  output: { ...esmOutput, dir: 'dist', format: 'es' },
  external: externalConfig,
  plugins: [
    ...commonPlugins,
    typescript({ tsconfig: './tsconfig.json', sourceMap: false, outDir: 'dist' }),
  ],
}])