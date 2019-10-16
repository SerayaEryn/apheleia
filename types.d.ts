export type LoggerOptions = {
  format?: Format
  stream?: WritableStream
  level?: string
  transports?: Transport[]
}

export function createLogger (options?: LoggerOptions): Logger

export class Logger {
  trace (message: string, ...args: Array<object | string | Error | any[]>): void
  debug (message: string, ...args: Array<object | string | Error | any[]>): void
  info (message: string, ...args: Array<object | string | Error | any[]>): void
  warn (message: string, ...args: Array<object | string | Error | any[]>): void
  error (message: string, ...args: Array<object | string | Error | any[]>): void
  fatal (message: string, ...args: Array<object | string | Error | any[]>): void
  child (meta: object): Logger
  getLevel (): string
  setLevel (level: string): void
  isLevelEnabled (level: string): boolean
  end (): Promise<void>
  addMetaData (key: string, value: any): void
}

export interface Format {
  transform (level: string, message: string, args: any[], meta: object | undefined): string
  formatMetaDataObject (meta: object): string
  formatMetaData (key: string, value: any): string
}

export type TransportOptions = {
  format: Format
  stream: WritableStream
}

export class Transport {
  constructor (options: TransportOptions)
  log (level: number, message: string, args: any[], meta: object | undefined): void
  formatMetaDataObject (meta: object | undefined): string
  formatMetaKey (key: string, value: any): string
  end (): Promise<void>
}

export class ConsoleTransport extends Transport {}