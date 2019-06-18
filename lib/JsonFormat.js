'use strict'

const DateFormat = require('fast-date-format')
const {
  DEFAULT_LEVELS,
  propertiesToIgnore
} = require('./Defaults')
const jsonEscape = require('json-escaping')
const { dateFormatterSym } = require('./Symbols')
const fastifySerializers = require('./FastifySerializers').json

module.exports = class JsonFormat {
  constructor (options = {}) {
    this[dateFormatterSym] = new DateFormat({
      dateFormat: options.dateFormat || 'x',
      cache: options.fastTimestamp
    })
    this.serializers = options.serializers || fastifySerializers
  }

  transform (level, message, args, meta = '') {
    let timestamp = this[dateFormatterSym].format()
    let line = `{"time":${timestamp},"level":${DEFAULT_LEVELS[level]}`

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
      if (propertiesToIgnore.includes(key)) {
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
    if (propertiesToIgnore.includes(key)) {
      return ''
    }
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
        if (this.serializers[key]) {
          return this.serializers[key](value)
        }
        if (value === null) {
          return `,"${key}":null`
        }
        return `,"${key}":${JSON.stringify(value)}`
    }
  }
}
