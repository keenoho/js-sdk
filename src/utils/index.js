export function makeResponse(data, code = 0, msg = 'ok') {
  const res = {
    data,
    code,
    msg,
  };
  return res;
}
