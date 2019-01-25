'use strict'

const { Transport } = require('./Transport')
const { EOL } = require('os')

const stderrLevelsSym = Symbol('apheleia.stderrLevels')
const formatSym = Symbol('apheleia.format')

module.exports = class ConsoleStream extends Transport {
  constructor (options) {
    super({})
    this[formatSym] = options.format
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

  end (callback) {
    callback()
  }
}
