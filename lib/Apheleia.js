'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const JsonFormat = require('./JsonFormat')
const Transport = require('./Transport')
const ConsoleTransport = require('./ConsoleTransport')
const { DEFAULT_LEVEL } = require('./Defaults')

function createLogger (options = {}) {
  options.levelString = options.level || DEFAULT_LEVEL
  options.transports = options.transports || [getTransport(options)]
  return new Logger(options)
}

function getTransport (options) {
  const format = options.format || new SimpleFormat()
  if (!options.stream) {
    return new ConsoleTransport({ format })
  } else {
    const stream = options.stream
    return new Transport({ stream, format })
  }
}

module.exports = {
  createLogger,
  Transport,
  SimpleFormat,
  JsonFormat,
  ConsoleTransport
}
