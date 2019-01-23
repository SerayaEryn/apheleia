'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const Transport = require('./Transport')

const defaultLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}

function createLogger (options = {}) {
  const transport = new Transport({
    stream: options.stream || process.stdout,
    format: options.format || new SimpleFormat()
  })
  return new Logger({
    transports: [ transport ],
    levels: options.levels || defaultLevels,
    level: options.level
  })
}

module.exports = {
  createLogger,
  Transport,
  Logger,
  SimpleFormat
}
