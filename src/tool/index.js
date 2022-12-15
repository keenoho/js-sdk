import { getStoreRequest } from '../request/index';
import { ToolTransferMail } from '../api/index';
import { makeResponse } from '../utils/index';

// 转发邮件
export function transferMail(options) {
  const { request = getStoreRequest(), ...data } = options;
  const signature = request?.handleMap?.getSignatureFunc() || '';
  if (!signature) {
    throw makeResponse(null, -1, '签名缺失');
  }
  return ToolTransferMail(request, data);
}
