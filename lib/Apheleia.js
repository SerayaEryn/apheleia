'use strict'

const Logger = require('./Logger')
const SimpleFormat = require('./SimpleFormat')
const JsonFormat = require('./JsonFormat')
const Transport = require('./Transport')
const ConsoleTransport = require('./ConsoleTransport')
const { DEFAULT_LEVELS, DEFAULT_LEVEL } = require('./Defaults')
const {
  addMethodsForLevelsSym,
  levelsArraySym,
  levelStringSym,
  levelSym,
  levelsSym,
  transportsSym,
  preparedMetasSym
} = require('./Symbols')

function createLogger (options = {}) {
  const levels = options.levels || DEFAULT_LEVELS
  const levelString = options.level || DEFAULT_LEVEL
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
  JsonFormat,
  ConsoleTransport
}
