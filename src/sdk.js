import { v4 as UUID } from 'uuid';
import { loadConfig } from './config';
import { baseRequest } from './request';
import { generateSign, generateSignature } from './util';
import EventEmitter from './eventEmitter';

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

export class SDK extends EventEmitter {
  static getSessionHandler() {
    return sessionStorage.getItem('keenoho_session');
  }

  static setSessionHandler(val) {
    return sessionStorage.setItem('keenoho_session', val);
  }

  constructor(config) {
    super();
    this.event;
    this.config = config || loadConfig();
    this.token = undefined;
    this.tokenExpired = undefined;
    this.init();
  }

  async init() {
    await this.initToken();
    this.emit('ready', this);
  }

  async initToken(ttl = 7200) {
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

  request(axiosOptions = sdkDefaultAxiosOptions, requestOptions = sdkDefualtRequestOptions) {
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

  userLogin(data) {
    return this.request({
      url: '/v1/user/login',
      method: 'POST',
      data,
    }).then((res) => {
      const { session } = res?.data || {};
      SDK.setSessionHandler(session);
      return res;
    });
  }

  userInfo() {
    return this.request({
      url: '/v1/user/info',
    });
  }
}
