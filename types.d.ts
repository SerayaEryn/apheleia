export type LoggerOptions = {
  format: Format
  stream: WritableStream
  level: string
  transports: Transport[]
}

export function createLogger (options: LoggerOptions | undefined): Logger

export class Logger {
  trace (message: string, ...args: any[]): void
  debug (message: string, ...args: any[]): void
  info (message: string, ...args: any[]): void
  warn (message: string, ...args: any[]): void
  error (message: string, ...args: any[]): void
  fatal (message: string, ...args: any[]): void
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