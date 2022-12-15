import axios from 'axios';
import { makeResponse } from '../utils/index';

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

export class Request {
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
export function createRequestInstance(options) {
  storeRequest = new Request(options);
  return storeRequest;
}

export function getStoreRequest() {
  return storeRequest;
}
