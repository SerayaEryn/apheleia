'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const Transport = require('./Transport')
const ConsoleTransport = require('./ConsoleTransport')

const defaultLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}

function createLogger (options = {}) {
  const transport = getTransport(options)
  return new Logger({
    transports: [ transport ],
    levels: options.levels || defaultLevels,
    level: options.level
  })
}

function getTransport (options) {
  const format = options.format || new SimpleFormat()
  if (!options.stream) {
    return new ConsoleTransport({
      format
    })
  } else {
    return new Transport({
      stream: options.stream,
      format
    })
  }
}

module.exports = {
  createLogger,
  Transport,
  Logger,
  SimpleFormat,
  ConsoleTransport
}
