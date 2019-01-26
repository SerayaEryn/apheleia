'use strict'

const eachAsync = require('async-each')

const addMethodsForLevels = Symbol('apheleia.addMethodsForLevels')
const transportsSym = Symbol('apheleia.transports')
const levelsSym = Symbol('apheleia.levels')
const levelSym = Symbol('apheleia.level')
const preparedMetasSym = Symbol('apheleia.preparedMeta')
const prepareMetaSym = Symbol('apheleia.prepareMeta')

const defaultLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}

module.exports = class Logger {
  constructor (options) {
    this[transportsSym] = options.transports
    this[levelsSym] = options.levels || defaultLevels
    this[levelSym] = this[levelsSym][options.level || 'INFO']
    this[addMethodsForLevels]()
    this[preparedMetasSym] = []
  }

  child (meta) {
    const logger = new Logger({
      transports: this[transportsSym],
      levels: this[levelsSym],
      level: Object.keys(this[levelsSym])[this[levelSym]]
    })
    logger[prepareMetaSym](meta)
    logger.end = function end (callback) {
      callback()
    }
    return logger
  }

  log (level, message, ...args) {
    if (this[levelsSym][level] >= this[levelSym]) {
      for (let index = 0; index < this[transportsSym].length; index++) {
        const transport = this[transportsSym][index]
        transport.log(level, message, args, this[preparedMetasSym][index])
      }
    }
  }

  end (callback) {
    eachAsync(this[transportsSym], (transport, cb) => {
      transport.end(cb)
    }, callback)
  }

  [prepareMetaSym] (meta) {
    const preparedMetas = new Array(this[transportsSym].length)
    for (let index = 0; index < this[transportsSym].length; index++) {
      const transport = this[transportsSym][index]
      preparedMetas[index] = transport.prepareMeta(meta)
    }
    this[preparedMetasSym] = preparedMetas
  }

  [addMethodsForLevels] () {
    for (const level of Object.keys(this[levelsSym])) {
      this[level.toLowerCase()] = (message, ...args) => {
        this.log(level, message, ...args)
      }
    }
  }
}
