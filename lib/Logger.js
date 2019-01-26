'use strict'

const eachAsync = require('async-each')
const {
  addMethodsForLevelsSym,
  levelsArraySym,
  levelStringSym,
  levelSym,
  levelsSym,
  transportsSym,
  preparedMetasSym,
  prepareMetaSym
} = require('./Symbols')

module.exports = class Logger {
  child (meta) {
    const logger = new Logger()
    logger[transportsSym] = this[transportsSym]
    logger[levelsSym] = this[levelsSym]
    logger[levelStringSym] = this[levelStringSym]
    logger[levelSym] = this[levelSym]
    logger[levelsArraySym] = this[levelsArraySym]
    logger[addMethodsForLevelsSym]()
    logger[prepareMetaSym](meta)
    logger.end = end
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

  [addMethodsForLevelsSym] () {
    for (const level of this[levelsArraySym]) {
      this[level.toLowerCase()] = (message, ...args) => {
        this.log(level, message, ...args)
      }
    }
  }
}

function end (callback) {
  callback()
}
