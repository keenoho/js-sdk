import { getConfig, checkConfig, setConfig } from '../config';
import { get, post } from '../util/request';
import { apiMap } from '../constant';

export function login(options) {
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

export function info(options) {
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
