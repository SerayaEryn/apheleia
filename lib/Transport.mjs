import { EOL } from 'node:os'
import { formatSym } from './Symbols.mjs'

export class Transport {
  #stream

  constructor (options) {
    this.#stream = options.stream
    this[formatSym] = options.format
  }

  log (level, message, args, meta) {
    const line = this[formatSym].transform(level, message, args, meta)
    this.#stream.write(`${line}${EOL}`)
  }

  formatMetaDataObject (meta) {
    return this[formatSym].formatMetaDataObject(meta)
  }

  formatMetaData (key, value) {
    return this[formatSym].formatMetaData(key, value)
  }

  end () {
    return new Promise((resolve) => {
      this.#stream.on('finish', resolve)
      this.#stream.end()
    })
  }
}
