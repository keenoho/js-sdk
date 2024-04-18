const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(rootDir, 'src');
const isWatch = !!process.argv.find((v) => v.indexOf('watch') > -1);
const optionList = [
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.js',
  },
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.min.js',
    minify: true,
    drop: ['console', 'debugger'],
  },
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.external.js',
    external: ['axios', 'crypto-js', 'md5', 'uuid'],
  },
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.external.min.js',
    external: ['axios', 'crypto-js', 'md5', 'uuid'],
    minify: true,
    drop: ['console', 'debugger'],
  },
];

function checkNodeVersion() {
  const versions = process.version.replace('v', '').split('.');
  if (versions[0] < 18) {
    throw new Error('node version must older than 18');
  }
}

async function buildFiles() {
  console.time('build');
  const buildList = [];
  for (const option of optionList) {
    const p = esbuild.build({
      bundle: true,
      charset: 'utf8',
      format: 'iife',
      globalName: 'Keenoho',
      sourcemap: true,
      treeShaking: true,
      target: 'es2015',
      ...option,
    });
    buildList.push(p);
  }
  await Promise.all(buildList);
  console.timeEnd('build');
}

async function run() {
  checkNodeVersion();
  await buildFiles();
  if (isWatch) {
    console.log('watching file change...')
    let debounceTimer;
    const watchCallback = (e, name) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        buildFiles();
      }, 500);
    };
    fs.watch(srcDir, { recursive: true }, watchCallback);
  }
}
run();
