'use strict'

const streamSym = Symbol('apheleia.stream')
const formatSym = Symbol('apheleia.format')

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

  end (callback) {
    this[streamSym].on('finish', callback)
    this[streamSym].end()
  }
}
