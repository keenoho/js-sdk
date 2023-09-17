import axios from 'axios';
import { getConfig } from '../config';
import { computeSession } from '../signature';

const defaultAxiosOptions = {
  url: '',
  baseURL: '',
  params: undefined,
  data: undefined,
  headers: undefined,
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

export function request(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions = Object.assign({}, defaultAxiosOptions, axiosOptions);
  requestOptions = Object.assign({}, defaultRequestOption, requestOptions);
  return Request({
    ...axiosOptions,
    requestOptions,
  });
}

export function get(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions.method = 'GET';
  return request(axiosOptions, requestOptions);
}

export function post(axiosOptions = defaultAxiosOptions, requestOptions = defaultRequestOption) {
  axiosOptions.method = 'POST';
  return request(axiosOptions, requestOptions);
}
