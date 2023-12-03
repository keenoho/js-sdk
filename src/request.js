import axios from 'axios';
import { makeResponse } from './util';

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

export function baseRequest(axiosOptions = defaultAxiosOptions, requestOptions = defualtRequestOptions) {
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
