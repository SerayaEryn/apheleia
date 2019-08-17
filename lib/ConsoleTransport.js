'use strict'

const Transport = require('./Transport')

const {
  formatSym,
  stderrLevelsSym
} = require('./Symbols')
const { EOL } = require('os')

module.exports = class ConsoleTransport extends Transport {
  constructor (options) {
    super({ format: options.format })
    this[stderrLevelsSym] = options.stderrLevels || {
      WARN: true,
      ERROR: true,
      FATAL: true
    }
  }

  log (level, message, args, meta) {
    const line = this[formatSym].transform(level, message, args, meta)
    if (this[stderrLevelsSym][level]) {
      process.stderr.write(`${line}${EOL}`)
    } else {
      process.stdout.write(`${line}${EOL}`)
    }
  }

  end () {
    return Promise.resolve()
  }
}
