'use strict'

const DateFormat = require('fast-date-format')
const { DEFAULT_LEVELS } = require('./Defaults')
const jsonEscape = require('json-escaping')
const { levelsSym, dateFormatterSym } = require('./Symbols')

module.exports = class JsonFormat {
  constructor (options = {}) {
    this[dateFormatterSym] = new DateFormat({
      dateFormat: options.dateFormat || 'x',
      cache: options.fastTimestamp
    })
    this[levelsSym] = options.levels || DEFAULT_LEVELS
    if (options.ignoreFastifyProperties === false) {
      this.ignoreFastifyProperties = false
    } else {
      this.ignoreFastifyProperties = true
    }
  }

  transform (level, message, args, meta = '') {
    let timestamp = this[dateFormatterSym].format()
    let line = `{"time":${timestamp},"level":${this[levelsSym][level]}`

    let stack = null
    let code = null
    let msg = message
    for (const arg of args) {
      if (!arg) {
        continue
      }
      if (arg.stack) {
        stack = jsonEscape(arg.stack)
        if (arg.code) {
          code = arg.code
        }
        continue
      }
      switch (typeof arg) {
        case 'string':
          msg += ' ' + arg
          break
        case 'object':
          for (const key in arg) {
            line += this.formatMetaData(key, arg[key])
          }
          break
      }
    }

    line += `,"msg":${jsonEscape(msg)}`
    if (stack) {
      line += `,"error":${stack}`
    }
    if (code) {
      line += `,"code":"${code}"`
    }
    return line + meta + '}\n'
  }

  formatMetaDataObject (meta = {}) {
    let result = ''
    for (const key in meta) {
      if (key === 'serializers' && this.ignoreFastifyProperties) {
        continue
      }
      if (key === 'level' || key === 'message') {
        continue
      }
      const value = meta[key]
      result += this.formatMetaData(key, value)
    }
    return result
  }

  formatMetaData (key, value) {
    switch (typeof value) {
      case 'undefined':
      case 'function':
        return ''
      case 'number':
      case 'boolean':
        return `,"${key}":${value}`
      case 'string':
        return `,"${key}":${jsonEscape(value)}`
      default:
        return `,"${key}":${JSON.stringify(value)}`
    }
  }
}
