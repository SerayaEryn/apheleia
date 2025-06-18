export function serialzeRequestJson(request) {
  const { url, connection, method, ip, hostname } = request;
  const remotePort = connection && connection.remotePort;
  return `,"req":{"method":"${method}","url":"${url}","hostname":"${hostname}","remoteAddress":"${ip}","remotePort":${remotePort}}`;
}

export function serialzeResponseJson(reply) {
  const { statusCode } = reply;
  return `,"res":{"statusCode":${statusCode}}`;
}

export function serialzeRequestSimple(request) {
  const { url, connection, method, ip, hostname } = request;
  const remotePort = connection && connection.remotePort;
  return ` method=${method} url=${url} hostname=${hostname} remoteAddress=${ip} remotePort=${remotePort}`;
}

export function serialzeResponseSimple(reply) {
  const { statusCode } = reply;
  return ` statusCode=${statusCode}`;
}
