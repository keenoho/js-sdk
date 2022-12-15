const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');

function getNextVersion() {
  const std = childProcess.execSync(`npm view ${packageJson.name} version`);
  const latestVersion = (std.toString() || '').replace(/[\n\s]+/g, '');
  let [one, two, three] = latestVersion.split('.').map((v) => Number(v) || 0);
  three += 1;
  if (three >= 100) {
    three = 0;
    two += 1;
  }
  if (two >= 100) {
    two = 0;
    one += 1;
  }
  return [one, two, three].join('.');
}

const nextVersion = getNextVersion();
packageJson.version = nextVersion;

const ws = fs.createWriteStream(path.resolve(__dirname, '../package.json'), {
  encoding: 'utf-8',
});

ws.on('finish', () => {});
ws.write(JSON.stringify(packageJson, null, '\t'));
