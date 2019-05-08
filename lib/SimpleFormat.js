'use strict'

const DateFormat = require('fast-date-format')
const fastifySerializers = require('./FastifySerializers').simple

module.exports = class SimpleFormat {
  constructor (options = {}) {
    this.dateFormatter = new DateFormat({
      dateFormat: options.dateFormat || 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
      cache: options.fastTimestamp
    })
    if (options.ignoreFastifyProperties === false) {
      this.ignoreFastifyProperties = false
    } else {
      this.ignoreFastifyProperties = true
    }
    this.serializers = options.serializers || fastifySerializers
  }

  transform (level, message, args, meta = '') {
    let date = this.dateFormatter.format()
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
      line += this._format(arg)
    }
    return `${date} ${level} ${message}${line}${meta}${stack}`
  }

  formatMetaDataObject (meta = {}) {
    let result = ''
    for (const key in meta) {
      if (key === 'serializers' && this.ignoreFastifyProperties) {
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
    if (!value) {
      return ''
    }
    return ` ${key}=${value}`
  }

  _format (arg) {
    switch (typeof arg) {
      case 'object':
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
      case 'function':
        return ''
      default:
        return ' ' + arg
    }
  }
}
