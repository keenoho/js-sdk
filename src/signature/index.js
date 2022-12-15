import { v4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { SignatureGet, SignatureCheck, SignatureRefresh, SignatureAuth } from '../api/index';
import { getStoreRequest } from '../request/index';

// 计算sig
function computeSig(app, nonce, ts, ttl, data, secretkey) {
  const str = `${app}${nonce}${ts}${ttl}${data}`
    .split('')
    .sort((a, b) => {
      return String(a).charCodeAt(0) - String(b).charCodeAt(0);
    })
    .join('');
  const sig = CryptoJS.HmacSHA1(str, secretkey);
  const sigStr = CryptoJS.enc.Hex.stringify(sig);
  return sigStr;
}

// 获取签名
export async function getSignature(options) {
  const { app, secretkey, request = getStoreRequest() } = options;
  const ts = Date.now();
  const ttl = 14400;
  const nonce = v4();
  const data = '';
  const sig = computeSig(app, nonce, ts, ttl, data, secretkey);
  const signature = await SignatureGet(request, {
    app,
    nonce,
    ts,
    ttl,
    data,
    sig,
  });
  return signature;
}

// 检查签名
export function checkSignature(options) {
  const { request = getStoreRequest() } = options || {};
  return SignatureCheck(request);
}

// 刷新签名
export function refreshSignature(options) {
  const { request = getStoreRequest() } = options || {};
  return SignatureRefresh(request);
}

// 授权签名
export function authSignature(options) {
  const { request = getStoreRequest(), ...data } = options;
  return SignatureAuth(request, data);
}

// 完整初始化签名过程
export async function initSignature(options) {
  const { app, secretkey, getSignatureFunc, setSignatureFunc, request = getStoreRequest() } = options;
  let signature;
  let data;
  if (typeof getSignatureFunc === 'function' && getSignatureFunc()) {
    const flag = await checkSignature({ request })
      .then((res) => {
        if (res && res.data) {
          data = res.data;
          if (Date.now > res.data.expired) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      })
      .catch(() => false);
    if (flag) {
      signature = await refreshSignature({ request });
      setSignatureFunc(signature);
      return { signature, data };
    }
  }

  signature = await getSignature({ app, secretkey, request });
  if (typeof setSignatureFunc === 'function') {
    setSignatureFunc(signature);
  }
  return { signature, data };
}
