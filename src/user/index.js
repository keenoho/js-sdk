import { getStoreRequest } from '../request/index';
import { SignatureAuth, UserInfo, UserRole, UserPermission } from '../api/index';
import { makeResponse } from '../utils/index';

export function login(options) {
  const { request = getStoreRequest(), baseSignature, ...data } = options;
  const signature = baseSignature || request?.handleMap?.getSignatureFunc() || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return SignatureAuth(request, data);
}

export function getUserInfo(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserInfo(request, { id, ...params });
}

export function getUserRole(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserRole(request, { id, ...params });
}

export function getUserPermission(options) {
  const { id, request = getStoreRequest(), ...params } = options || {};
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!id && !signature) {
    throw makeResponse(null, -1, '需要输入id或已登陆');
  }
  return UserPermission(request, { id, ...params });
}
