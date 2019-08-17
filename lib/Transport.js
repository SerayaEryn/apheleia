'use strict'

const {
  formatSym,
  streamSym
} = require('./Symbols')
const { EOL } = require('os')

module.exports = class Transport {
  constructor (options) {
    this[streamSym] = options.stream
    this[formatSym] = options.format
  }

  log (level, message, args, meta) {
    const line = this[formatSym].transform(level, message, args, meta)
    this[streamSym].write(`${line}${EOL}`)
  }

  formatMetaDataObject (meta) {
    return this[formatSym].formatMetaDataObject(meta)
  }

  formatMetaData (key, value) {
    return this[formatSym].formatMetaData(key, value)
  }

  end () {
    return new Promise((resolve) => {
      this[streamSym].on('finish', resolve)
      this[streamSym].end()
    })
  }
}
