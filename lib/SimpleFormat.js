'use strict'

const DateFormat = require('fast-date-format')

module.exports = class SimpleFormat {
  constructor (options = {}) {
    this.dateFormatter = new DateFormat({
      dateFormat: options.dateFormat || 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
      cache: options.fastTimestamp === false ? false : true
    })
  }

  transform (level, message, args, meta = '') {
    let date = this.dateFormatter.format()
    let stack = ''
    let line = ''
    for (const arg of args) {
      if (arg.stack) {
        stack = '\n' + arg.stack
        continue
      }
      line += format(arg)
    }
    return `${date} ${level} ${message}${line}${meta}${stack}`
  }

  prepareMeta (meta = {}) {
    let result = ''
    for (const key in meta) {
      const value = meta[key]
      result += ` ${key}=${value}`
    }
    return result
  }
}

function format (arg) {
  switch (typeof arg) {
    case 'object':
      return '\n' + JSON.stringify(arg)
    case 'function':
      return ''
    default:
      return ' ' + arg
  }
}
