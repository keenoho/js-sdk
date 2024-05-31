const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');
const isWatch = !!process.argv.find((v) => v.indexOf('watch') > -1);
const externals = {
  axios: 'axios',
  'crypto-js': 'CryptoJS',
  uuid: 'uuid',
};
const sdkBuildList = [
  // full
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.js',
    format: 'iife',
    globalName: 'Keenoho',
    target: ['es2015'],
  },
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.min.js',
    format: 'iife',
    globalName: 'Keenoho',
    target: ['es2015'],
    minify: true,
    drop: ['console', 'debugger'],
  },
  // external
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.external.js',
    format: 'iife',
    globalName: 'Keenoho',
    target: ['es2015'],
    packages: 'external',
    inject: ['./inject.js'],
    plugins: [injectPlugin()],
  },
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.umd.external.min.js',
    format: 'iife',
    globalName: 'Keenoho',
    target: ['es2015'],
    minify: true,
    drop: ['console', 'debugger'],
    packages: 'external',
    inject: ['./inject.js'],
    plugins: [injectPlugin()],
  },
  // cjs
  {
    entryPoints: ['./index.js'],
    outfile: './dist/keenoho.cjs.js',
    format: 'cjs',
    target: 'esnext',
    drop: ['console', 'debugger'],
    packages: 'external',
  },
];

function checkNodeVersion() {
  const versions = process.version.replace('v', '').split('.');
  if (versions[0] < 18) {
    throw new Error('node version must older than 18');
  }
}

function cleanDist() {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }
  for (const sub of fs.readdirSync(distDir)) {
    fs.rmSync(path.resolve(distDir, sub), { force: true });
  }
}

async function buildFiles() {
  console.time('build');
  const buildList = [];
  for (const option of sdkBuildList) {
    const p = esbuild.build({
      bundle: true,
      charset: 'utf8',
      sourcemap: true,
      treeShaking: true,
      ...option,
    });
    buildList.push(p);
  }
  await Promise.all(buildList);
  console.timeEnd('build');
}

function injectPlugin() {
  return {
    name: 'injectPlugin',
    setup(build) {
      build.onResolve({ filter: /inject/ }, (args) => {
        return {
          path: args.path,
          namespace: 'injectPlugin',
        };
      });

      build.onLoad({ filter: /inject/ }, (args) => {
        let contents = fs.readFileSync(path.resolve(rootDir, args.path), 'utf-8');
        contents = `const externals = ${JSON.stringify(externals)};\n` + contents;
        return {
          loader: 'js',
          contents,
        };
      });
    },
  };
}

function handleWatch() {
  console.log('watching file change...');
  let debounceTimer;
  const watchCallback = (e, name) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      buildFiles();
    }, 500);
  };
  fs.watch(srcDir, { recursive: true }, watchCallback);
}

async function run() {
  checkNodeVersion();
  cleanDist();
  await buildFiles();

  if (isWatch) {
    handleWatch();
  }
}
run();
