import { getConfig, loadConfig, setConfig } from './config';
import Logger from './util/logger';
import EventEmitter from './util/eventEmitter';
import { sign, check, refresh, data } from './signature';
import { login, info } from './user';
import { request } from './util/request';

const storeKeyMap = {
  signature: 'keenoho_signature',
  app: 'keenoho_app',
  publicKey: 'keenoho_publicKey',
};

export default class SDK extends (Logger, EventEmitter) {
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
