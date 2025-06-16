import { Transport } from './Transport.mjs'
import { EOL } from 'os'
import { formatSym } from './Symbols.mjs'

export class ConsoleTransport extends Transport {
  #stderrLevels

  constructor (options) {
    super({ format: options.format })
    this.#stderrLevels = options.stderrLevels || {
      WARN: true,
      ERROR: true,
      FATAL: true
    }
  }

  log (level, message, args, meta) {
    const line = this[formatSym].transform(level, message, args, meta)
    if (this.#stderrLevels[level]) {
      process.stderr.write(`${line}${EOL}`)
    } else {
      process.stdout.write(`${line}${EOL}`)
    }
  }

  end () {
    return Promise.resolve()
  }
}
