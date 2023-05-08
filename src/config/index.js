import { judgePlatform } from '../util';
import { PLATFORM_BROWSER } from '../constant';

const storeConfig = {
  platform: judgePlatform(),
  app: undefined,
  signature: undefined,
  publicKey: undefined,
  env: 'production',
  mode: 'production',
  apiHost: undefined,
  ttl: 3200,
};

export function loadBrowserConfig() {
  const app = window.APP || undefined;
  const env = window.ENV || undefined;
  const mode = window.MODE || undefined;
  const publicKey = window.APP_PUBLIC_KEY || undefined;
  const ttl = window.SIGNATURE_TTL || 3200;
  const apiHost =
    window.SYSTEMCE_HOST ||
    (location.protocol.indexOf('https') > -1 ? 'http://api.keenoho.space' : 'https://api.keenoho.space');
  setConfig({
    app,
    env,
    mode,
    publicKey,
    ttl,
    apiHost,
  });
}

export function loadNodeConfig() {}

export function loadConfig() {
  if (judgePlatform() === PLATFORM_BROWSER) {
    loadBrowserConfig();
  } else {
    loadNodeConfig();
  }
}

export function getConfig(key) {
  if (key in storeConfig) {
    return storeConfig[key];
  }
  return storeConfig;
}

export function setConfig(key, value) {
  if (arguments.length == 1 && typeof arguments[0] === 'object') {
    for (let k in arguments[0]) {
      storeConfig[k] = arguments[0][k];
    }
  } else if (arguments.length == 2) {
    storeConfig[key] = value;
  }
}

export function checkConfig(checkSignature = false) {
  if (!storeConfig.app || !storeConfig.publicKey) {
    throw new Error('the app or publicKey is not set in config, please use setConfig to set the values');
  }
  if (checkSignature && !storeConfig.signature) {
    throw new Error('the signature has not sign, please use signature.sign to sign');
  }
}
