// base
export function SignatureGet(request, params) {
  return request.get({
    url: '/v1/signature',
    params,
    needSignature: false,
  });
}

export function SignatureCheck(request) {
  return request.get({
    url: '/v1/signature/check',
  });
}

export function SignatureRefresh(request) {
  return request.get({
    url: '/v1/signature/refresh',
  });
}

export function SignatureAuth(request, data) {
  return request.post({
    url: '/v1/signature/auth',
    data,
  });
}

export function UserInfo(request, params) {
  return request.get({
    url: '/v1/user/info',
    params,
  });
}

export function UserRole(request, params) {
  return request.get({
    url: '/v1/user/role',
    params,
  });
}

export function UserPermission(request, params) {
  return request.get({
    url: '/v1/user/permission',
    params,
  });
}

// tools
export function ToolTransferMail(request, data) {
  return request.post({
    url: '/v1/mail/transfer',
    data,
  });
}
