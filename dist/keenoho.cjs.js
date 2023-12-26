'use strict';

var axios = require('axios');
var cryptoJs = require('crypto-js');
var uuid = require('uuid');

function loadConfig() {
  let config = {
    ENV: 'production',
    API_HOST: 'http://api.keenoho.space',
    APP_ID: 2000000000000000,
  };

  let configTarget = typeof document === 'object' ? window : typeof process === 'object' ? process && process.env || null : null;

  if (!configTarget) {
    return configTarget
  }
  if ('ENV' in configTarget) {
    config.ENV = configTarget.ENV;
  }
  if ('API_HOST' in configTarget) {
    config.API_HOST = configTarget.API_HOST;
  }
  if ('APP_ID' in configTarget) {
    config.APP_ID = configTarget.APP_ID;
  }

  return config;
}

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadConfig: loadConfig
});

function generateSign(app, ttl, ts, randId) {
  const str = `${app}${ts}${ttl}${randId}`.split('').sort().join('');
  return cryptoJs.HmacSHA1(str, app.toString()).toString();
}

function generateSignature(url, app, token) {
  const str = `${app}:${url}`.split('').sort().join('');
  const res = cryptoJs.HmacSHA1(str, token).toString();
  return res;
}

function makeResponse(data = null, code = 0, msg = 'ok') {
  return {
    data,
    code,
    msg,
    time: Date.now(),
  };
}

const defaultAxiosOptions = {
  url: '',
  baseURL: '',
  params: undefined,
  data: undefined,
  headers: undefined,
  method: 'GET',
};

const defualtRequestOptions = {
  checkCode: true,
  targetCode: 0,
};

function baseRequest(axiosOptions = defaultAxiosOptions, requestOptions = defualtRequestOptions) {
  let { baseURL, url, params, data, headers, method } = Object.assign({}, defaultAxiosOptions, axiosOptions);
  let { checkCode, targetCode } = Object.assign({}, defualtRequestOptions, requestOptions);

  return new Promise((resolve, reject) => {
    axios({
      baseURL,
      url,
      params,
      data,
      headers,
      method,
    })
      .then((res) => {
        if (!res || !('data' in res)) {
          throw makeResponse(null, -1, 'request error');
        }
        const resData = res.data;
        if (checkCode) {
          if (!('code' in resData)) {
            throw makeResponse(null, -1, 'code is not in response');
          }
          if (resData.code !== targetCode) {
            throw resData;
          }
        }
        resolve(resData);
      })
      .catch((err) => {
        let data = null;
        let code = -1;
        let msg = 'request error';

        if (err?.response?.data && typeof err?.response?.data === 'object' && 'data' in err?.response?.data) {
          data = err?.response?.data?.data || data;
          code = err?.response?.data?.code || code;
          msg = err?.response?.data?.msg || msg;
        } else if (err?.data && typeof err?.data === 'object' && 'data' in err?.data) {
          data = err?.data?.data || data;
          code = err?.data?.code || code;
          msg = err?.data?.msg || msg;
        } else {
          data = err?.data || data;
          code = err?.code || code;
          msg = err?.msg || msg;
        }
        let resData = makeResponse(data, code, msg);
        reject(resData);
      })
      .finally(() => {});
  });
}

var request = /*#__PURE__*/Object.freeze({
  __proto__: null,
  baseRequest: baseRequest
});

class EventEmitter {
  constructor() {
    this.eventMap = {};
  }

  on(event, callback) {
    this.eventMap[event] = callback;
  }

  off(event, callback) {
    delete this.eventMap[event];
  }

  emit(event, ...args) {
    if (event in this.eventMap && typeof this.eventMap[event] === 'function') {
      this.eventMap[event](...args);
    }
  }
}

const sdkDefaultAxiosOptions = {
  url: '',
  params: undefined,
  data: undefined,
  headers: undefined,
  method: 'GET',
};

const sdkDefualtRequestOptions = {
  showLoading: false,
  handleLoadingFunc: undefined,
  showError: false,
  handleErrorFunc: undefined,
  checkCode: true,
  targetCode: 0,
};

const sdkDefaultOptions = {
  autoRenewToken: true,
  tokenTtl: 28800,
};

class SDK extends EventEmitter {
  static getSessionHandler() {
    return localStorage.getItem('keenoho_session');
  }

  static setSessionHandler(session, expired, user) {
    localStorage.setItem('keenoho_session', session);
    localStorage.setItem('keenoho_session_expired', expired);
    return {
      session,
      expired,
    };
  }

  constructor(config, sdkOption = sdkDefaultOptions) {
    super();
    this.event;
    this.sdkOption = sdkOption;
    this.config = config || loadConfig();
    this.token = undefined;
    this.tokenExpired = undefined;
    this.init();
  }

  async init() {
    await this.initToken();
    this.emit('ready', this);
  }

  async initToken(ttl = this.sdkOption?.tokenTtl) {
    const baseURL = this.config.API_HOST;
    const app = this.config.APP_ID;
    const ts = Date.now();
    const randId = uuid.v4();
    const sign = generateSign(app, ttl, ts, randId);
    const res = await baseRequest({
      baseURL,
      url: '/v1/signature/token',
      method: 'GET',
      params: {
        app,
        ttl,
        ts,
        randId,
        sign,
      },
    });
    const { token, expired } = res?.data || {};
    this.token = token;
    this.tokenExpired = expired;
  }

  async checkTokenExpired(
    autoRenew = this.sdkOption?.autoRenew,
    tokenTtl = this.sdkOption?.tokenTtl,
    early = 10 * 60 * 1000
  ) {
    if (!this.token || !this.tokenExpired) {
      return;
    }
    let isExpired = Date.now >= this.tokenExpired - early;
    if (isExpired && autoRenew) {
      await this.initToken(tokenTtl).then(() => {
        isExpired = false;
      });
    }
    return isExpired;
  }

  async request(axiosOptions = sdkDefaultAxiosOptions, requestOptions = sdkDefualtRequestOptions) {
    await this.checkTokenExpired();
    const aopt = Object.assign({}, sdkDefaultAxiosOptions, axiosOptions);
    const ropt = Object.assign({}, sdkDefualtRequestOptions, requestOptions);

    const token = this.token;
    const baseURL = this.config.API_HOST;
    const app = this.config.APP_ID;
    const sid = SDK.getSessionHandler();
    const headers = {
      'x-app': app,
      'x-tk': token,
      'x-sig': generateSignature(axiosOptions.url, app, token),
      'x-sid': sid,
    };

    aopt.baseURL = baseURL;
    aopt.headers = Object.assign(headers, aopt.headers);

    return baseRequest(aopt, ropt);
  }

  // signature
  signatureTest() {
    return this.request({
      url: '/v1/signature/test',
    });
  }

  sessionCheck() {
    return this.request({
      url: '/v1/signature/session/check',
    });
  }

  sessionRefresh() {
    return this.request({
      url: '/v1/signature/session/refresh',
    });
  }

  // user
  userSignin(data) {
    return this.request({
      url: '/v1/user/signin',
      method: 'POST',
      data,
    });
  }

  userLogin(data) {
    return this.request({
      url: '/v1/user/login',
      method: 'POST',
      data,
    }).then((res) => {
      const { session, expired, user } = res?.data || {};
      SDK.setSessionHandler(session, expired, user);
      return res;
    });
  }

  userInfo(params) {
    return this.request({
      url: '/v1/user/info',
      params,
    });
  }

  userUpdate(data) {
    return this.request({
      url: '/v1/user/update',
      method: 'POST',
      data,
    });
  }

  // file
  async fileUpload(filePath, file) {
    const token = await this.request({
      url: '/v1/file/token',
      method: 'POST',
      data: { filePath },
    }).then((res) => {
      if (res?.code === 0) {
        return res?.data;
      }
    });
    if (!token) {
      throw new Error('get file upload token fail');
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filePath', filePath);
    formData.append('token', token);

    return this.request({
      url: '/v1/file/upload',
      method: 'POST',
      data: formData,
    });
  }
}

var SDK$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SDK: SDK,
  sdkDefaultAxiosOptions: sdkDefaultAxiosOptions,
  sdkDefaultOptions: sdkDefaultOptions,
  sdkDefualtRequestOptions: sdkDefualtRequestOptions
});

// import { isBrowser } from './src/util';

var index = {
  config,
  request,
  ...SDK$1,
};

module.exports = index;
//# sourceMappingURL=keenoho.cjs.js.map
