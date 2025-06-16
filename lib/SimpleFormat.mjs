import { DateFormatter } from 'fast-date-format'
import { serialzeRequestSimple, serialzeResponseSimple } from './FastifySerializers.mjs'
import { propertiesToIgnore } from './Defaults.mjs'

export class SimpleFormat {
  constructor (options = {}) {
    this.dateFormatter = new DateFormatter({
      dateFormat: options.dateFormat || 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
      cache: options.fastTimestamp
    })
    this.serializers = options.serializers || { req: serialzeRequestSimple, res: serialzeResponseSimple }
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
      line += this.#format(arg)
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

  #format (arg) {
    switch (typeof arg) {
      case 'object':
        return this.#formatObject(arg)
      case 'function':
        return ''
      default:
        return ' ' + arg
    }
  }

  #formatObject (arg) {
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
