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
    this[preparedMetasSym] = new Array(this[transportsSym].length)
  }

  child (meta) {
    const logger = new Logger({
      transports: this[transportsSym],
      levelString: this[levelStringSym],
      level: this[levelSym]
    })
    logger[prepareMetaSym](meta, this[preparedMetasSym])
    logger.end = end
    return logger
  }

  end () {
    const promises = this[transportsSym].map(endTransport)
    return Promise.all(promises)
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

  getLevel () {
    return this[levelStringSym]
  }

  setLevel (levelString) {
    const level = this[levelsSym][levelString]
    if (level === undefined) {
      const error = new Error('Unknown level: ' + levelString);
      error.code = 'APH_ERR_UNKNOWN_LEVEL'
      throw error
    }
    this[levelStringSym] = levelString
    this[levelSym] = level
  }

  isLevelEnabled (level) {
    return this[levelsSym][level] >= this[levelSym]
  }

  addMetaData (key, value) {
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      this[preparedMetasSym][index] = (this[preparedMetasSym][index] || '') + transport.formatMetaData(key, value)
    }
  }

  [logSym] (level, message, args) {
    if (!this.isLevelEnabled(level)) {
      return
    }
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      transport.log(level, message, args, this[preparedMetasSym][index])
    }
  }

  [prepareMetaSym] (meta, parentMeta) {
    const preparedMetas = new Array(this[transportsSym].length)
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      if (!parentMeta[index]) {
        preparedMetas[index] = transport.formatMetaDataObject(meta)
      } else {
        preparedMetas[index] = parentMeta + transport.formatMetaDataObject(meta)
      }
    }
    this[preparedMetasSym] = preparedMetas
  }
}

function end () {
  return Promise.resolve()
}

function endTransport (transport) {
  return transport.end()
}
