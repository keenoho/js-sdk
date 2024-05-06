import md5 from 'md5';
import { v4 as UUID } from 'uuid';
import { loadConfig } from './config';
import { baseRequest } from './request';
import { generateSign, generateSignature } from './util';
import EventEmitter from './eventEmitter';

export const sdkDefaultAxiosOptions = {
  url: '',
  params: undefined,
  data: undefined,
  headers: undefined,
  method: 'GET',
};

export const sdkDefualtRequestOptions = {
  showLoading: false,
  handleLoadingFunc: undefined,
  showError: false,
  handleErrorFunc: undefined,
  checkCode: true,
  targetCode: 0,
};

export const sdkDefaultOptions = {
  autoRenewToken: true,
  tokenTtl: 3600 * 4,
};

export class SDK extends EventEmitter {
  static getSessionHandler(onlySessionId = false) {
    if (onlySessionId) {
      return localStorage.getItem('keenoho_session') || '';
    }
    return {
      session: localStorage.getItem('keenoho_session') || '',
      expired: +localStorage.getItem('keenoho_session_expired') || undefined,
    };
  }

  static setSessionHandler(res) {
    if (res?.data?.session) {
      localStorage.setItem('keenoho_session', res?.data?.session || '');
    }
    if (res?.data?.expired) {
      localStorage.setItem('keenoho_session_expired', res?.data?.expired || '');
    }
  }

  static removeSessionHandler() {
    localStorage.removeItem('keenoho_session');
    localStorage.removeItem('keenoho_session_expired');
  }

  constructor(config, sdkOption) {
    super();
    this.event;
    this.sdkOption = Object.assign({}, sdkDefaultOptions, sdkOption);
    this.config = Object.assign({}, loadConfig(), config);
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
    const randId = UUID();
    const sign = generateSign(app, ttl, ts, randId);
    const res = await this.sdkBaseRequest({
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

  usePlugin(plugin, option) {
    if (plugin?.install && typeof plugin.install === 'function') {
      plugin.install(this, option);
    }
  }

  async checkTokenExpired(tokenTtl = this.sdkOption?.tokenTtl, early = 60 * 1000) {
    if (!this.token || !this.tokenExpired) {
      return;
    }
    let isExpired = Date.now() >= this.tokenExpired - early;
    if (isExpired && this.sdkOption?.autoRenewToken) {
      await this.initToken(tokenTtl).then(() => {
        isExpired = false;
      });
    }
    return isExpired;
  }

  sdkBaseRequest(aopt = sdkDefaultAxiosOptions, ropt = sdkDefualtRequestOptions) {
    return baseRequest(aopt, ropt)
      .then((res) => res)
      .catch((err) => {
        this.emit('error', err);
        throw err;
      });
  }

  async request(axiosOptions = sdkDefaultAxiosOptions, requestOptions = sdkDefualtRequestOptions) {
    await this.checkTokenExpired();
    const aopt = Object.assign({}, sdkDefaultAxiosOptions, axiosOptions);
    const ropt = Object.assign({}, sdkDefualtRequestOptions, requestOptions);

    const token = this.token;
    const baseURL = this.config.API_HOST;
    const app = this.config.APP_ID;
    const sid = SDK.getSessionHandler(true);
    const headers = {
      'x-app': app,
      'x-tk': token,
      'x-sig': generateSignature(axiosOptions.url, app, token),
      'x-sid': sid,
    };

    aopt.baseURL = baseURL;
    aopt.headers = Object.assign(headers, aopt.headers);

    return this.sdkBaseRequest(aopt, ropt);
  }

  // signature
  signatureCheck() {
    return this.request({
      url: '/v1/signature/check',
    });
  }

  // session
  sessionLogin(data, setSessionHandler = SDK.setSessionHandler) {
    const sendData = { ...data };
    if (sendData.password) {
      sendData.password = md5(sendData.password);
    }
    return this.request({
      method: 'POST',
      url: '/v1/session/login',
      data: sendData,
    }).then((res) => {
      setSessionHandler(res);
      return res;
    });
  }

  sessionLogout() {
    return this.request({
      method: 'POST',
      url: '/v1/session/logout',
    }).then((res) => {
      SDK.removeSessionHandler(res);
      return res;
    });
  }

  sessionCheck() {
    return this.request({
      url: '/v1/session/check',
    });
  }

  sessionRefresh(data) {
    return this.request({
      method: 'POST',
      url: '/v1/session/refresh',
      data,
    }).then((res) => {
      SDK.setSessionHandler(res);
      return res;
    });
  }

  // tool
  uploadFile({ filePath, file }) {
    return this.request({
      url: '/v1/file/token',
      method: 'GET',
      params: { filePath },
    })
      .then((res) => {
        if (res?.code !== 0) {
          throw res;
        }
        const token = res?.data;
        if (!token) {
          throw new Error('获取上传token失败');
        }
        return token;
      })
      .then((token) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filePath', filePath);
        formData.append('token', token);

        return this.request({
          url: '/v1/file/upload',
          method: 'POST',
          data: formData,
        });
      });
  }

  // user
  userInfo(params) {
    return this.request({
      url: '/v1/user/info',
      method: 'GET',
      params,
    });
  }
}
