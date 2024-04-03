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
  tokenTtl: 28800,
};

export class SDK extends EventEmitter {
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
    const randId = UUID();
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
    let isExpired = Date.now() >= this.tokenExpired - early;
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
