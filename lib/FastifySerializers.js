'use strict'

function serialzeRequestJson (request) {
  const { url, connection, method, ip, hostname } = request
  const remotePort = connection && connection.remotePort
  return `,"req":{"method":"${method}"` +
    `,"url":"${url}"` +
    `,"hostname":"${hostname}"` +
    `,"remoteAddress":"${ip}"` +
    `,"remotePort":${remotePort}}`
}

function serialzeResponseJson (reply) {
  const { statusCode } = reply
  return `,"res":{"statusCode":${statusCode}}`
}

function serialzeRequestSimple (request) {
  const { url, connection, method, ip, hostname } = request
  const remotePort = connection && connection.remotePort
  return ` method=${method}` +
    ` url=${url}` +
    ` hostname=${hostname}` +
    ` remoteAddress=${ip}` +
    ` remotePort=${remotePort}`
}

function serialzeResponseSimple (reply) {
  const { statusCode } = reply
  return ` statusCode=${statusCode}`
}

module.exports = {
  json: {
    req: serialzeRequestJson,
    res: serialzeResponseJson
  },
  simple: {
    req: serialzeRequestSimple,
    res: serialzeResponseSimple
  }
}
