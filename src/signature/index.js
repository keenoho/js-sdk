import CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { getConfig, checkConfig, setConfig } from '../config';
import { get } from '../util/request';

const apiMap = {
  v1: {
    SignatureSign: '/v1/signature/sign',
    SignatureCheck: '/v1/signature/check',
    SignatureRefresh: '/v1/signature/refresh',
  },
};

export function computeSign(app, ts, ttl, uid, publicKey) {
  const str = `${app}${ts}${ttl}${uid}`.split('').sort().join('');
  return CryptoJS.HmacSHA1(str, publicKey);
}

export function computeSession(app, path, sign) {
  const str = `${app}:${path}`.split('').sort().join('');
  return CryptoJS.HmacSHA1(str, sign);
}

export async function sign() {
  checkConfig();
  const { app, publicKey, ttl } = getConfig();
  const ts = Date.now();
  const uid = uuid();
  const sig = computeSign(app, ts, ttl, uid, publicKey);
  const res = await get(
    {
      url: apiMap.v1.SignatureSign,
      params: {
        app,
        ts,
        ttl,
        sig,
        randomId: uid,
      },
    },
    {
      needApp: false,
      needSignature: false,
      needSessionId: false,
    }
  );
  if (res && res.code === 0) {
    setConfig('signature', res.data);
  }
  return res;
}

export async function check() {
  checkConfig();
  return await get({
    url: apiMap.v1.SignatureCheck,
    params: {},
  });
}

export async function refresh() {
  checkConfig();
  return await get({
    url: apiMap.v1.SignatureRefresh,
    params: {},
  });
}
