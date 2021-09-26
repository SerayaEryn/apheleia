import { Writable } from "stream"

export type LoggerOptions = {
  format?: Format
  stream?: Writable
  level?: string
  transports?: Transport[]
}

export function createLogger (options?: LoggerOptions): Logger

export class Logger {
  trace (message: string, ...args: Array<object | string | Error>): void
  debug (message: string, ...args: Array<object | string | Error>): void
  info (message: string, ...args: Array<object | string | Error>): void
  warn (message: string, ...args: Array<object | string | Error>): void
  error (message: string, ...args: Array<object | string | Error>): void
  fatal (message: string, ...args: Array<object | string | Error>): void
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
  stream: Writable
}

export class Transport {
  constructor (options: TransportOptions)
  log (level: number, message: string, args: any[], meta: object | undefined): void
  formatMetaDataObject (meta: object | undefined): string
  formatMetaKey (key: string, value: any): string
  end (): Promise<void>
}

export class ConsoleTransport extends Transport {}

export class SimpleFormat implements Format {
  transform(level: string, message: string, args: any[], meta: object): string
  formatMetaDataObject(meta: object): string
  formatMetaData(key: string, value: any): string
}

export class JsonFormat implements Format {
  transform(level: string, message: string, args: any[], meta: object): string
  formatMetaDataObject(meta: object): string
  formatMetaData(key: string, value: any): string
}
