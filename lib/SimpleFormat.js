'use strict'

const DateFormat = require('fast-date-format')
const fastifySerializers = require('./FastifySerializers').simple
const { propertiesToIgnore } = require('./Defaults')
const { formatSym, formatObjectSym } = require('./Symbols')

module.exports = class SimpleFormat {
  constructor (options = {}) {
    this.dateFormatter = new DateFormat({
      dateFormat: options.dateFormat || 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
      cache: options.fastTimestamp
    })
    this.serializers = options.serializers || fastifySerializers
  }

  transform (level, message, args, meta = '') {
    const date = this.dateFormatter.format()
    let stack = ''
    let line = ''
    for (const arg of args) {
      if (!arg) {
        continue
      }
      if (arg.stack) {
        stack = '\n' + arg.stack
        continue
      }
      line += this[formatSym](arg)
    }
    return `${date} ${level} ${message}${line}${meta}${stack}`
  }

  formatMetaDataObject (meta = {}) {
    let result = ''
    for (const key in meta) {
      if (propertiesToIgnore.includes(key)) {
        continue
      }
      if (key === 'level') {
        continue
      }
      const value = meta[key]
      result += this.formatMetaData(key, value)
    }
    return result
  }

  formatMetaData (key, value) {
    if (value === undefined) {
      return ''
    }
    return ` ${key}=${value}`
  }

  [formatSym] (arg) {
    switch (typeof arg) {
      case 'object':
        return this[formatObjectSym](arg)
      case 'function':
        return ''
      default:
        return ' ' + arg
    }
  }

  [formatObjectSym] (arg) {
    let formatted = ''
    for (const key in arg) {
      if (key === 'level' || key === 'message') {
        continue
      }
      if (this.serializers[key]) {
        formatted += this.serializers[key](arg[key])
      } else {
        formatted += this.formatMetaData(key, arg[key])
      }
    }
    return formatted
  }
}
