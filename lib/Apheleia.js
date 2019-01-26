'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const Transport = require('./Transport')
const ConsoleTransport = require('./ConsoleTransport')

function createLogger (options = {}) {
  const transport = getTransport(options)
  return new Logger({
    transports: [ transport ],
    levels: options.levels,
    level: options.level
  })
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
  Logger,
  SimpleFormat,
  ConsoleTransport
}
