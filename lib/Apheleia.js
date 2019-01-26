'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const Transport = require('./Transport')
const ConsoleTransport = require('./ConsoleTransport')
const {
  addMethodsForLevelsSym,
  levelsArraySym,
  levelStringSym,
  levelSym,
  levelsSym,
  transportsSym,
  preparedMetasSym
} = require('./Symbols')

const defaultLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}

function createLogger (options = {}) {
  const levels = options.levels || defaultLevels
  const levelString = options.level || 'INFO'
  const logger = new Logger()
  logger[transportsSym] = options.transports || [ getTransport(options) ]
  logger[levelsSym] = levels
  logger[levelStringSym] = levelString
  logger[levelSym] = levels[levelString]
  logger[levelsArraySym] = Object.keys(levels)
  logger[addMethodsForLevelsSym]()
  logger[preparedMetasSym] = []
  return logger
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
  ConsoleTransport
}
