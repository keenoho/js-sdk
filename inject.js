const externalMaps = {
  axios: 'axios',
  'crypto-js': 'CryptoJS',
  uuid: 'uuid',
};

const oldRequire = require;
require = function (name) {
  try {
    return oldRequire(name);
  } catch (err) {
    if (name in externalMaps && externalMaps[name] in window) {
      return window[externalMaps[name]]
    }
    return oldRequire(name);
  }
};
