import { Logger } from './Logger.mjs'
import { SimpleFormat } from './SimpleFormat.mjs'
import { JsonFormat } from './JsonFormat.mjs'
import { Transport } from './Transport.mjs'
import { ConsoleTransport } from './ConsoleTransport.mjs'
import { DEFAULT_LEVEL } from './Defaults.mjs'

export function createLogger (options = {}) {
  options.levelString = options.level || DEFAULT_LEVEL
  options.transports = options.transports || [getTransport(options)]
  return new Logger(options)
}

function getTransport (options) {
  const format = options.format || new SimpleFormat()
  if (!options.stream) {
    return new ConsoleTransport({ format })
  } else {
    const stream = options.stream
    return new Transport({ stream, format })
  }
}

export {
  Transport,
  SimpleFormat,
  JsonFormat,
  ConsoleTransport
}
