'use strict'

const {
  levelStringSym,
  levelSym,
  levelsSym,
  logSym,
  transportsSym,
  preparedMetasSym,
  prepareMetaSym
} = require('./Symbols')
const { DEFAULT_LEVELS } = require('./Defaults')

module.exports = class Logger {
  constructor (options) {
    this[transportsSym] = options.transports
    this[levelsSym] = DEFAULT_LEVELS
    this[levelStringSym] = options.levelString
    this[levelSym] = DEFAULT_LEVELS[options.levelString]
    this[preparedMetasSym] = []
  }

  child (meta) {
    const logger = new Logger({
      transports: this[transportsSym],
      levelString: this[levelStringSym],
      level: this[levelSym]
    })
    logger[prepareMetaSym](meta)
    logger.end = end
    return logger
  }

  end () {
    const promises = this[transportsSym].map(endTransport)
    return Promise.all(promises)
  }

  [logSym] (level, message, args) {
    if (this[levelsSym][level] >= this[levelSym]) {
      for (let index = 0; index < this[transportsSym].length; index++) {
        const transport = this[transportsSym][index]
        transport.log(level, message, args, this[preparedMetasSym][index])
      }
    }
  }

  [prepareMetaSym] (meta) {
    const preparedMetas = new Array(this[transportsSym].length)
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      preparedMetas[index] = transport.prepareMeta(meta)
    }
    this[preparedMetasSym] = preparedMetas
  }

  trace (message, ...args) {
    this[logSym]('TRACE', message, args)
  }

  debug (message, ...args) {
    this[logSym]('DEBUG', message, args)
  }

  info (message, ...args) {
    this[logSym]('INFO', message, args)
  }

  warn (message, ...args) {
    this[logSym]('WARN', message, args)
  }

  error (message, ...args) {
    this[logSym]('ERROR', message, args)
  }

  fatal (message, ...args) {
    this[logSym]('FATAL', message, args)
  }
}

function end () {
  return Promise.resolve()
}

function endTransport (transport) {
  return transport.end()
}
