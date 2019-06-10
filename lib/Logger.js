'use strict'

const {
  levelStringSym,
  levelSym,
  levelsSym,
  logSym,
  transportsSym,
  preparedMetasSym,
  prepareMetaSym,
  rawMetaSym,
  areMetaPreparedSym
} = require('./Symbols')
const { DEFAULT_LEVELS } = require('./Defaults')

module.exports = class Logger {
  constructor (options) {
    this[transportsSym] = options.transports
    this[levelsSym] = DEFAULT_LEVELS
    this[levelStringSym] = options.levelString
    this[levelSym] = DEFAULT_LEVELS[options.levelString]
    this[preparedMetasSym] = new Array(this[transportsSym].length)
    this[rawMetaSym] = {}
    this[areMetaPreparedSym] = false
  }

  child (meta) {
    const logger = new Logger({
      transports: this[transportsSym],
      levelString: this[levelStringSym],
      level: this[levelSym]
    })
    logger[rawMetaSym] = Object.assign({}, this[rawMetaSym], meta)
    logger.end = end
    return logger
  }

  end () {
    const promises = this[transportsSym].map(endTransport)
    return Promise.all(promises)
  }

  trace (object, message, ...args) {
    this[logSym]('TRACE', object, message, args)
  }

  debug (object, message, ...args) {
    this[logSym]('DEBUG', object, message, args)
  }

  info (object, message, ...args) {
    this[logSym]('INFO', object, message, args)
  }

  warn (object, message, ...args) {
    this[logSym]('WARN', object, message, args)
  }

  error (object, message, ...args) {
    this[logSym]('ERROR', object, message, args)
  }

  fatal (object, message, ...args) {
    this[logSym]('FATAL', object, message, args)
  }

  getLevel () {
    return this[levelStringSym]
  }

  setLevel (levelString) {
    const level = this[levelsSym][levelString]
    if (level === undefined) {
      const error = new Error('Unknown level: ' + levelString)
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
    this[rawMetaSym][key] = value
    this[areMetaPreparedSym] = false // TODO: Test
  }

  log (object, message, args) {
    const level = object.level || this[levelStringSym]
    this[logSym](level, object, message, args)
  }

  [logSym] (level, object, message, args) {
    if (!this.isLevelEnabled(level)) {
      return
    }
    if (!this[areMetaPreparedSym]) {
      this[prepareMetaSym](this[rawMetaSym])
      this[areMetaPreparedSym] = true
    }
    if (object != null) {
      const type = typeof object
      if (type === 'object') {
        args = [ object ].concat(args)
        if (object.message) {
          message = object.message
        }
      } else if (type === 'string') {
        if (message != null) {
          args = [ message ].concat(args)
        }
        message = object
      }
    }
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      transport.log(level, message, args, this[preparedMetasSym][index])
    }
  }

  [prepareMetaSym] (meta) {
    const preparedMetas = new Array(this[transportsSym].length)
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      preparedMetas[index] = transport.formatMetaDataObject(meta)
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
