const fs = require('fs');
const path = require('path');
const babelPlugin = require('@rollup/plugin-babel');
const tersrPlugin = require('@rollup/plugin-terser');

const COMMAND = process.env.COMMAND;
const isBuild = COMMAND === 'build';

function createExternal() {
  if (isBuild) {
    return {
      external: ['axios', 'crypto-js', 'uuid', 'md5'],
      globals: {
        axios: 'axios',
        'crypto-js': 'CryptoJS',
        uuid: 'uuid',
        md5: 'MD5',
      },
    };
  }
  return {
    external: [],
    globals: {},
  };
}

function createOutput(isMin = false, outputOptions = {}) {
  const baseOutput = {
    dir: './dist',
    format: 'umd',
    name: 'Keenoho',
    exports: 'named',
    entryFileNames: isMin ? '[name].min.js' : '[name].js',
    sourcemap: true,
    // compact: isMin,
    // plugins: isMin ? [tersrPlugin()] : [],
    // globals: createExternal().globals,
  };
  return {
    ...baseOutput,
    ...outputOptions,
  };
}

function createPlugin() {
  return [
    // babelPlugin.babel({
    //   babelHelpers: 'bundled',
    // }),
    // babelPlugin.getBabelOutputPlugin({
    //   allowAllFormats: true,
    //   presets: [['@babel/preset-env']],
    // }),
  ];
}

function removeDistDir(distPath = path.resolve(process.cwd(), './dist')) {
  // if (fs.existsSync(distPath)) {
  //   fs.rmdirSync(distPath);
  // }
}

exports.NODE_ENV = NODE_ENV;
exports.isBuild = isBuild;
exports.removeDistDir = removeDistDir;
exports.createExternal = createExternal;
exports.createOutput = createOutput;
exports.createPlugin = createPlugin;
