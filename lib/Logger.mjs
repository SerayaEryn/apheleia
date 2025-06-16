import { DEFAULT_LEVELS } from './Defaults.mjs'

export class Logger {
  #transports
  #levels = DEFAULT_LEVELS
  #levelString
  #level
  #preparedMetas
  #rawMeta = {}
  #areMetaPrepared

  constructor (options) {
    this.#transports = options.transports
    this.#levelString = options.levelString
    this.#level = DEFAULT_LEVELS[options.levelString]
    this.#preparedMetas = new Array(this.#transports.length)
    this.#areMetaPrepared = false
  }

  child (meta) {
    const logger = new Logger({
      transports: this.#transports,
      levelString: this.#levelString,
      level: this.#level
    })
    logger.setRawMeta(this.#rawMeta, meta)
    logger.end = end
    return logger
  }

  end () {
    const promises = this.#transports.map(endTransport)
    return Promise.all(promises)
  }

  trace (object, message, ...args) {
    this.#log('TRACE', object, message, args)
  }

  debug (object, message, ...args) {
    this.#log('DEBUG', object, message, args)
  }

  info (object, message, ...args) {
    this.#log('INFO', object, message, args)
  }

  warn (object, message, ...args) {
    this.#log('WARN', object, message, args)
  }

  error (object, message, ...args) {
    this.#log('ERROR', object, message, args)
  }

  fatal (object, message, ...args) {
    this.#log('FATAL', object, message, args)
  }

  getLevel () {
    return this.#levelString
  }

  setLevel (levelString) {
    const level = this.#levels[levelString]
    if (level === undefined) {
      const error = new Error('Unknown level: ' + levelString)
      error.code = 'APH_ERR_UNKNOWN_LEVEL'
      throw error
    }
    this.#levelString = levelString
    this.#level = level
  }

  isLevelEnabled (level) {
    return this.#levels[level] >= this.#level
  }

  addMetaData (key, value) {
    this.#rawMeta[key] = value
    this.#areMetaPrepared = false // TODO: Test
  }

  log (object, message, args) {
    const level = object.level || this.#levelString
    this.#log(level, object, message, args)
  }

  #log (level, object, message, args) {
    if (!this.isLevelEnabled(level)) {
      return
    }
    if (!this.#areMetaPrepared) {
      this.#prepareMeta(this.#rawMeta)
      this.#areMetaPrepared = true
    }
    if (object != null) {
      const type = typeof object
      if (type === 'object') {
        args = [object].concat(args)
        if (object.message) {
          message = object.message
        }
      } else if (type === 'string') {
        if (message != null) {
          args = [message].concat(args)
        }
        message = object
      }
    }
    for (let index = 0; index < this.#transports.length; index++) {
      const transport = this.#transports[index]
      transport.log(level, message, args, this.#preparedMetas[index])
    }
  }

  #prepareMeta (meta) {
    const preparedMetas = new Array(this.#transports.length)
    for (let index = 0; index < this.#transports.length; index++) {
      const transport = this.#transports[index]
      preparedMetas[index] = transport.formatMetaDataObject(meta)
    }
    this.#preparedMetas = preparedMetas
  }

  setRawMeta (parentRawMeta, rawMeta) {
    if (Object.keys(parentRawMeta).length !== 0) {
      this.#rawMeta = Object.assign({}, parentRawMeta, rawMeta)
    } else {
      this.#rawMeta = rawMeta
    }
  }
}

function end () {
  return Promise.resolve()
}

function endTransport (transport) {
  return transport.end()
}
