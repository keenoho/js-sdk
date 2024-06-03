import { HmacSHA1, AES } from 'crypto-js';

export function isBrowser() {
  return typeof document === 'object';
}

export function generateSign(app, ttl, ts, randId) {
  const str = `${app}${ts}${ttl}${randId}`.split('').sort().join('');
  return HmacSHA1(str, app.toString()).toString();
}

export function generateSignature(url, app, token) {
  const str = `${app}:${url}`.split('').sort().join('');
  const res = HmacSHA1(str, token).toString();
  return res;
}

export function makeResponse(data = null, code = 0, msg = 'ok') {
  return {
    data,
    code,
    msg,
    time: Date.now(),
  };
}
