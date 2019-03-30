'use strict'

const {
  formatSym,
  streamSym
} = require('./Symbols')

module.exports = class Transport {
  constructor (options) {
    this[streamSym] = options.stream
    this[formatSym] = options.format
  }

  log (level, message, args, meta) {
    const line = this[formatSym].transform(level, message, args, meta)
    this[streamSym].write(`${line}\n`)
  }

  prepareMeta (meta) {
    if (this[formatSym].prepareMeta) {
      return this[formatSym].prepareMeta(meta)
    } else {
      return meta
    }
  }

  end () {
    return new Promise((resolve) => {
      this[streamSym].on('finish', resolve)
      this[streamSym].end()
    })
  }
}
