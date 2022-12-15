'use strict';

var axios = require('axios');
var uuid = require('uuid');
var CryptoJS = require('crypto-js');

function makeResponse(data, code = 0, msg = 'ok') {
  const res = {
    data,
    code,
    msg,
  };
  return res;
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  makeResponse: makeResponse
});

function getConfig() {
  let appConf;
  let mode = window.MODE || 'production';
  let env = window.ENV || 'production';
  if (window.APPCONF) {
    appConf = JSON.parse(decodeURIComponent(atob(window.APPCONF)));
  }
  return {
    appConf,
    mode,
    env,
  };
}

function setConfig(config) {
  window.MODE = config.mode;
  window.ENV = config.env;
  window.APPCONF = window.btoa(JSON.stringify(config.appConf));
}

var config = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getConfig: getConfig,
  setConfig: setConfig
});

function defaultErrorHandler(err, reqOpts) {
  const { showError } = reqOpts;
  const msg = err?.response?.data?.msg || err?.data?.msg || err?.msg || err?.message || '网络错误';
  const code = err?.response?.data?.code || err?.data?.code || err?.code || err?.code || -1;
  if (showError && typeof this.handleMap.showErrorFunc === 'function') {
    this.handleMap.showErrorFunc(msg);
  }

  if (code >= -1 && code < 30000 && code != 20005) {
    if (typeof this.handleMap.setSignatureFunc === 'function') {
      this.handleMap.setSignatureFunc(null);
    }
    if (typeof this.handleMap.goToLoginFunc === 'function') {
      this.handleMap.goToLoginFunc();
    }
  }

  if (typeof err !== 'object') {
    return err;
  } else {
    const data = err?.response?.data || err?.data || err;
    return data;
  }
}

class Request {
  constructor({
    baseURL = '',
    getSignatureFunc,
    setSignatureFunc,
    goToLoginFunc,
    showErrorFunc,
    getAppFunc,
    errorhandler = defaultErrorHandler,
  }) {
    this.baseURL = baseURL;
    this.handleMap = {
      getSignatureFunc,
      setSignatureFunc,
      goToLoginFunc,
      showErrorFunc,
      getAppFunc,
    };
    this.errorHandler = errorhandler;
  }

  send(options) {
    const {
      method = 'GET',
      url,
      data,
      params,
      baseURL,
      targetCode = 0,
      targetStatus = 200,
      takeInnerData = false,
      validResult = true,
      needApp = true,
      needSignature = true,
      headerApp,
      headerSignature,
      headers = {},
    } = options;
    return new Promise((resolve, reject) => {
      if (needApp) {
        headers['X-APP'] = headerApp || this.handleMap.getAppFunc() || '';
      }
      if (needApp && !headers['X-APP']) {
        reject(this.errorHandler(makeResponse(null, -1, 'app缺失'), options));
        return;
      }

      if (needSignature) {
        headers['X-SIGNATURE'] = headerSignature || this.handleMap.getSignatureFunc() || '';
      }
      if (needSignature && !headers['X-SIGNATURE']) {
        reject(this.errorHandler(makeResponse(null, -1, '签名缺失'), options));
        return;
      }

      axios({
        method,
        baseURL: baseURL || this.baseURL || '',
        url,
        data,
        params,
        headers,
      })
        .then((res) => {
          const { data, status } = res;

          if (status !== targetStatus) {
            throw res;
          }

          if (typeof data !== 'object') {
            return resolve(data);
          }

          if (!validResult) {
            return resolve(data);
          }

          const { code } = data;
          if (code !== targetCode) {
            throw res;
          }
          const finalData = data?.data || data;

          if (takeInnerData) {
            resolve(finalData);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(this.errorHandler(err, options));
        });
    });
  }

  get(options) {
    return this.send({
      ...options,
      method: 'GET',
    });
  }

  post(options) {
    return this.send({
      ...options,
      method: 'POST',
    });
  }
}

let storeRequest;
function createRequestInstance(options) {
  storeRequest = new Request(options);
  return storeRequest;
}

function getStoreRequest() {
  return storeRequest;
}

var request = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Request: Request,
  createRequestInstance: createRequestInstance,
  getStoreRequest: getStoreRequest
});

// base
function SignatureGet(request, params) {
  return request.get({
    url: '/v1/signature',
    params,
    needSignature: false,
  });
}

function SignatureCheck(request) {
  return request.get({
    url: '/v1/signature/check',
  });
}

function SignatureRefresh(request) {
  return request.get({
    url: '/v1/signature/refresh',
  });
}

function SignatureAuth(request, data) {
  return request.post({
    url: '/v1/signature/auth',
    data,
  });
}

function UserInfo(request, params) {
  return request.get({
    url: '/v1/user/info',
    params,
  });
}

function UserRole(request, params) {
  return request.get({
    url: '/v1/user/role',
    params,
  });
}

function UserPermission(request, params) {
  return request.get({
    url: '/v1/user/permission',
    params,
  });
}

// tools
function ToolTransferMail(request, data) {
  return request.post({
    url: '/v1/mail/transfer',
    data,
  });
}

// 计算sig
function computeSig(app, nonce, ts, ttl, data, secretkey) {
  const str = `${app}${nonce}${ts}${ttl}${data}`
    .split('')
    .sort((a, b) => {
      return String(a).charCodeAt(0) - String(b).charCodeAt(0);
    })
    .join('');
  const sig = CryptoJS.HmacSHA1(str, secretkey);
  const sigStr = CryptoJS.enc.Hex.stringify(sig);
  return sigStr;
}

// 获取签名
async function getSignature(options) {
  const { app, secretkey, request = getStoreRequest() } = options;
  const ts = Date.now();
  const ttl = 14400;
  const nonce = uuid.v4();
  const data = '';
  const sig = computeSig(app, nonce, ts, ttl, data, secretkey);
  const signature = await SignatureGet(request, {
    app,
    nonce,
    ts,
    ttl,
    data,
    sig,
  });
  return signature;
}

// 检查签名
function checkSignature(options) {
  const { request = getStoreRequest() } = options || {};
  return SignatureCheck(request);
}

// 刷新签名
function refreshSignature(options) {
  const { request = getStoreRequest() } = options || {};
  return SignatureRefresh(request);
}

// 授权签名
function authSignature(options) {
  const { request = getStoreRequest(), ...data } = options;
  return SignatureAuth(request, data);
}

// 完整初始化签名过程
async function initSignature(options) {
  const { app, secretkey, getSignatureFunc, setSignatureFunc, request = getStoreRequest() } = options;
  let signature;
  let data;
  if (typeof getSignatureFunc === 'function' && getSignatureFunc()) {
    const flag = await checkSignature({ request })
      .then((res) => {
        if (res && res.data) {
          data = res.data;
          if (Date.now > res.data.expired) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);
    if (flag) {
      signature = await refreshSignature({ request });
      setSignatureFunc(signature);
      return { signature, data };
    }
  }

  signature = await getSignature({ app, secretkey, request });
  if (typeof setSignatureFunc === 'function') {
    setSignatureFunc(signature);
  }
  return { signature, data };
}

var signature = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getSignature: getSignature,
  checkSignature: checkSignature,
  refreshSignature: refreshSignature,
  authSignature: authSignature,
  initSignature: initSignature
});

function login(options) {
  const { request = getStoreRequest(), baseSignature, ...data } = options;
  const signature = baseSignature || request?.handleMap?.getSignatureFunc() || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return SignatureAuth(request, data);
}

function getUserInfo(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserInfo(request, { id, ...params });
}

function getUserRole(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserRole(request, { id, ...params });
}

function getUserPermission(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserPermission(request, { id, ...params });
}

var user = /*#__PURE__*/Object.freeze({
  __proto__: null,
  login: login,
  getUserInfo: getUserInfo,
  getUserRole: getUserRole,
  getUserPermission: getUserPermission
});

// 转发邮件
function transferMail(options) {
  const { request = getStoreRequest(), ...data } = options;
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return ToolTransferMail(request, data);
}

var tool = /*#__PURE__*/Object.freeze({
  __proto__: null,
  transferMail: transferMail
});

var index = {
  utils,
  config,
  request,
  signature,
  user,
  tool,
};

module.exports = index;
//# sourceMappingURL=sdk.js.map
