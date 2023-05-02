import fs from 'fs';
import path from 'path';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import autoExternal from 'rollup-plugin-auto-external';

const cleanDist = (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return;
  }
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const dir = fs.readdirSync(filePath);
    for (let fp of dir) {
      cleanDist(path.resolve(filePath, fp));
    }
    fs.rmdirSync(filePath);
  } else if (stat.isFile()) {
    fs.rmSync(filePath);
  }
};

const buildConfig = ({
  useExternal = false,
  isBrowser = false,
  isMinify = false,
  isEs5 = false,
  isSdk = false,
  output = {},
  plugins = [],
}) => {
  const externalIds = ['axios', 'crypto-js', 'uuid', 'md5'];
  const externalIdsMap = {
    axios: 'axios',
    'crypto-js': 'CryptoJS',
    uuid: 'uuid',
    md5: 'MD5',
  };
  const input = { keenoho: './index.js' };
  const baseOutput = {
    dir: `./dist${isBrowser ? '/browser' : ''}`,
    exports: 'default',
    name: 'Keenoho',
    sourcemap: true,
    globals: useExternal ? externalIdsMap : {},
  };

  return {
    external: useExternal ? externalIds : [],
    input,
    output: Array.isArray(output)
      ? output.map((o) => {
          return {
            ...baseOutput,
            ...o,
          };
        })
      : {
          ...baseOutput,
          ...output,
        },
    plugins: [
      json(),
      nodeResolve({ browser: isBrowser }),
      commonjs(),
      isEs5 &&
        babel({
          babelHelpers: 'bundled',
          presets: ['@babel/preset-env'],
        }),
      isMinify && terser(),
      ...plugins,
    ],
  };
};

export default () => {
  cleanDist(path.resolve(__dirname, './dist'));
  return [
    // browser: umd
    buildConfig({
      isBrowser: true,
      isEs5: true,
      output: [
        {
          entryFileNames: '[name].umd.js',
          format: 'umd',
          exports: 'default',
        },
      ],
    }),
    // browser minify: umd
    buildConfig({
      isBrowser: true,
      isEs5: true,
      isMinify: true,
      output: [
        {
          entryFileNames: '[name].umd.min.js',
          format: 'umd',
          exports: 'default',
        },
      ],
    }),
    // browser external: umd
    buildConfig({
      isBrowser: true,
      isEs5: true,
      useExternal: true,
      output: [
        {
          entryFileNames: '[name].umd.external.js',
          format: 'umd',
          exports: 'default',
        },
      ],
    }),
    // browser external minify: umd
    buildConfig({
      isBrowser: true,
      isEs5: true,
      useExternal: true,
      isMinify: true,
      output: [
        {
          entryFileNames: '[name].umd.external.min.js',
          format: 'umd',
          exports: 'default',
        },
      ],
    }),
    // node: cjs
    buildConfig({
      output: [
        {
          entryFileNames: '[name].js',
          format: 'cjs',
          exports: 'default',
        },
      ],
      plugins: [autoExternal()],
    }),
  ];
};
