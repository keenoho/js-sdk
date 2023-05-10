'use strict';

var CryptoJS = require('crypto-js');
var uuid = require('uuid');
var axios = require('axios');

const PLATFORM_NODE = 'node';
const PLATFORM_BROWSER = 'browser';
const apiMap = {
  v1: {
    SignatureSign: '/v1/signature/sign',
    SignatureCheck: '/v1/signature/check',
    SignatureRefresh: '/v1/signature/refresh',
    SignatureData: '/v1/signature/data',
    UserLogin: '/v1/user/login',
    UserInfo: '/v1/user/info',
  },
};

function judgePlatform() {
  return typeof document === 'undefined' ? PLATFORM_NODE : PLATFORM_BROWSER;
}

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

function loadBrowserConfig() {
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

function loadNodeConfig() {}

function loadConfig() {
  if (judgePlatform() === PLATFORM_BROWSER) {
    loadBrowserConfig();
  }
}

function getConfig(key) {
  if (key in storeConfig) {
    return storeConfig[key];
  }
  return storeConfig;
}

function setConfig(key, value) {
  if (arguments.length == 1 && typeof arguments[0] === 'object') {
    for (let k in arguments[0]) {
      storeConfig[k] = arguments[0][k] || storeConfig[k];
    }
  } else if (arguments.length == 2) {
    storeConfig[key] = value || storeConfig[key];
  }
}

function checkConfig(checkSignature = false) {
  if (!storeConfig.app || !storeConfig.publicKey) {
    throw new Error('the app or publicKey is not set in config, please use setConfig to set the values');
  }
  if (checkSignature && !storeConfig.signature) {
    throw new Error('the signature has not sign, please use signature.sign to sign');
  }
}

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  checkConfig: checkConfig,
  getConfig: getConfig,
  loadBrowserConfig: loadBrowserConfig,
  loadConfig: loadConfig,
  loadNodeConfig: loadNodeConfig,
  setConfig: setConfig
});

const defaultAxiosOptions = {
  url: '',
  baseURL: '',
  params: undefined,
  data: undefined,
  header: undefined,
  method: 'GET',
  cancelToken: undefined,
};
const defaultRequestOption = {
  needApp: true,
  needSignature: true,
  needSessionId: true,
  targetCode: 0,
  takeInnerData: false,
};

const Request = axios.create();
Request.interceptors.request.use(
  function (config) {
    const { requestOptions = defaultRequestOption } = config;
    const { app, signature, apiHost } = getConfig();
    if (!config.baseURL && apiHost) {
      config.baseURL = apiHost;
    }
    if (!config.headers) {
      config.headers = {};
    }
    if (requestOptions.needApp) {
      config.headers['x-app'] = app;
    }
    if (requestOptions.needSignature) {
      config.headers['x-signature'] = signature;
    }
    if (requestOptions.needSessionId) {
      const u = new URL(config.url.indexOf('http') > -1 ? config.url : config.baseURL + config.url);
      const pathname = u.pathname;
      config.headers['x-session-id'] = computeSession(app, pathname, signature);
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
Request.interceptors.response.use(
  function (response) {
    const { requestOptions = defaultRequestOption } = response.config;
    const data = response.data;
    if (typeof data === 'object' && 'code' in data && 'msg' in data) {
      const code = data.code;
      if (code !== requestOptions.targetCode) {
        throw data;
      }
    }

    let finalData = data;
    if (requestOptions.takeInnerData && typeof data === 'object' && 'data' in data) {
      finalData = data.data;
    }
    return finalData;
  },
  function (error) {
    if (error instanceof axios.AxiosError) {
      const { response } = error;
      if (!response) {
        return Promise.reject(error);
      }

      const { requestOptions = defaultRequestOption } = response.config;
      const data = response.data;
      if (typeof data === 'object' && 'code' in data && 'msg' in data) {
        const code = data.code;
        if (code !== requestOptions.targetCode) {
          return Promise.reject(data);
        }
      }

      let finalData = data;
      if (requestOptions.takeInnerData && typeof data === 'object' && 'data' in data) {
        finalData = data.data;
      }
      return Promise.reject(finalData);
    }
    return Promise.reject(error);
  }
);

function request(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions = Object.assign({}, defaultAxiosOptions, axiosOptions);
  requestOptions = Object.assign({}, defaultRequestOption, requestOptions);
  return Request({
    ...axiosOptions,
    requestOptions,
  });
}

function get(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions.method = 'GET';
  return request(axiosOptions, requestOptions);
}

function post(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions.method = 'POST';
  return request(axiosOptions, requestOptions);
}

var request$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get,
  post: post,
  request: request
});

function computeSign(app, ts, ttl, uid, publicKey) {
  const str = `${app}${ts}${ttl}${uid}`.split('').sort().join('');
  return CryptoJS.HmacSHA1(str, publicKey);
}

function computeSession(app, path, sign) {
  const str = `${app}:${path}`.split('').sort().join('');
  return CryptoJS.HmacSHA1(str, sign);
}

async function sign() {
  checkConfig();
  const { app, publicKey, ttl } = getConfig();
  const ts = Date.now();
  const uid = uuid.v4();
  const sig = computeSign(app, ts, ttl, uid, publicKey);
  const res = await get(
    {
      url: apiMap.v1.SignatureSign,
      params: {
        app,
        ts,
        ttl,
        sig,
        randomId: uid,
      },
    },
    {
      needApp: false,
      needSignature: false,
      needSessionId: false,
    }
  );
  if (res && res.code === 0) {
    setConfig('signature', res.data);
  }
  return res;
}

async function check() {
  checkConfig();
  return await get({
    url: apiMap.v1.SignatureCheck,
    params: {},
  });
}

async function refresh() {
  checkConfig();
  return await get({
    url: apiMap.v1.SignatureRefresh,
    params: {},
  });
}

async function data() {
  checkConfig();
  return await get({
    url: apiMap.v1.SignatureData,
    params: {},
  });
}

var signature = /*#__PURE__*/Object.freeze({
  __proto__: null,
  check: check,
  computeSession: computeSession,
  computeSign: computeSign,
  data: data,
  refresh: refresh,
  sign: sign
});

function login(options) {
  checkConfig();
  const { app } = getConfig();
  return post({
    url: apiMap.v1.UserLogin,
    data: {
      app,
      ...options,
    },
  });
}

function info(options) {
  checkConfig();
  const { app } = getConfig();
  return get({
    url: apiMap.v1.UserInfo,
    params: {
      app,
      ...options,
    },
  });
}

var user = /*#__PURE__*/Object.freeze({
  __proto__: null,
  info: info,
  login: login
});

class EventEmitter {
  callbacks = {};
  addEventListener(type, callback) {
    this.callbacks[type] = callback;
  }
  removeEventListener(type) {
    delete this.callbacks[type];
  }
  emit(type, ...args) {
    if (typeof this.callbacks[type] === 'function') {
      this.callbacks[type](...args);
    }
  }
}

const storeKeyMap = {
  signature: 'keenoho_signature',
  app: 'keenoho_app',
  publicKey: 'keenoho_publicKey',
};

class SDK extends (EventEmitter) {
  config = {};
  user = {};

  constructor() {
    super();
    this.initConfig();
    this.initSignature();
  }

  config(valueMap) {
    setConfig(valueMap);
    this.config = Object.assign(this.config, getConfig());
  }

  ready(callback) {
    this.addEventListener('ready', callback);
  }

  error(callback) {
    this.addEventListener('error', callback);
  }

  initConfig() {
    loadConfig();
    const storeApp = localStorage.getItem(storeKeyMap.app);
    const storePublicKey = localStorage.getItem(storeKeyMap.publicKey);
    this.config = Object.assign({}, getConfig());
    if (storeApp) {
      setConfig('app', +storeApp || undefined);
      this.config.app = +storeApp || undefined;
    }
    if (storePublicKey) {
      setConfig('publicKey', storePublicKey);
      this.config.publicKey = storePublicKey;
    }
  }

  async initSignature() {
    const storeSignature = localStorage.getItem(storeKeyMap.signature);
    if (storeSignature) {
      setConfig('signature', storeSignature);
      const checkRes = await check()
        .then(() => {
          return true;
        })
        .catch((err) => {
          setConfig('signature', undefined);
          localStorage.removeItem(storeKeyMap.signature);
          this.emit('error', err);
          return false;
        });

      if (checkRes) {
        const refreshRes = await refresh()
          .then(() => {
            return true;
          })
          .catch((err) => {
            setConfig('signature', undefined);
            localStorage.removeItem(storeKeyMap.signature);
            this.emit('error', err);
            return false;
          });
        if (refreshRes) {
          this.emit('ready');
          return;
        }
      }
    }
    await sign()
      .then((res) => {
        if (res && res.code == 0 && res.data) {
          return res.data;
        }
        throw res;
      })
      .then((res) => {
        localStorage.setItem(storeKeyMap.signature, res);
        this.emit('ready');
      })
      .catch((err) => {
        setConfig('signature', undefined);
        localStorage.removeItem(storeKeyMap.signature);
        this.emit('error', err);
      });
  }

  addPlugin(pluginFunc) {
    pluginFunc.call(this);
  }

  sendRequest(axiosOptions, requestOptions) {
    return request(axiosOptions, requestOptions);
  }

  login(options) {
    return login(options).then((res) => {
      if (res && res.code === 0) {
        this.user = res.data;
      }
      return res;
    });
  }

  info(options) {
    return info(options);
  }

  data() {
    return data();
  }
}

var index = {
  config,
  signature,
  user,
  request: request$1,
  SDK,
};

module.exports = index;
//# sourceMappingURL=keenoho.js.map
