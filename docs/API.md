# API

* [createLogger([options]): Logger](#createlogger)
* [Logger](#logger)
* [Transport(options)](#transportapi)
* [ConsoleTransport(options)](#consoletransportapi)
* [SimpleFormat([options])](#simpleformatapi)
* [JsonFormat([options])](#jsonformatapi)

<a id="createlogger"></a>
## createLogger([options]): Logger
Creates a new [`Logger`](#logger) instance.

```js
const { createLogger, SimpleFormat } = require('apheleia')
const fs = require('fs')

const logger = createLogger({
  stream: fs.createWriteStream(__dirname + '/app.log'),
  format: new SimpleFormat()
})
logger.info('hello world')
```
### stream (optional)
A Writable stream. If `undefined` a `ConsoleTransport` will be used.

### format (optional)

A format. Defaults to an instance of `SimpleFormat`.<br>

### level (optional)

Sets the log level of the logger. <br>
Default: `INFO`

### transports (optional)

Allows to set the transport of the logger.

## Logger

The logger supports the following levels: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` & `FATAL`
The logger provides a logging method for each level:

### Logger#trace(message: string, ...args): void
Writes a `TRACE` level log, if allowed by the `level` option.
### Logger#debug(message: string, ...args): void
Writes a `DEBUG` level log, if allowed by the `level` option.
### Logger#info(message: string, ...args): void
Writes a `INFO` level log, if allowed by the `level` option.
### Logger#warn(message: string, ...args): void
Writes a `WARN` level log, if allowed by the `level` option.
### Logger#error(message: string, ...args): void
Writes a `ERROR` level log, if allowed by the `level` option.
### Logger#fatal(message: string, ...args): void
Writes a `FATAL` level log, if allowed by the `level` option.

### Logger#child(meta: object): Logger

Creates a child logger with additional data.

Child loggers allow to create loggers with additional information; for example an id of a request or the name of a module.<br>
The provided additional information will be included every time a logging functions is being called on the child logger.

```js
const child = parentLogger.child({ requestId: 'abcd' })
child.info('hello world!')
```

### Logger#getLevel(): string

Returns the current level of the logger as a string.

### Logger#setLevel(level: string): void

Changes the level to the passed `level`.

### Logger#isLevelEnabled(level: string): boolean

Allows to check if a `level` is enabled.

### Logger#end(): Promise\<void>

Ends the logger by calling `end()` on every transport. Returns a Promise.

### Logger#addMetaData (key: string, value: any): void

Allows to add additional meta data to a logger or child logger.

<a id="transportapi"></a>
## Transport(options)

Creates a new Transport instance.

```js
new Transport({
  stream: fs.createWriteStream('/dev/null'),
  format: new SimpleFormat()
}
```

### stream

A Writable stream.

### format

A format used to stringify the parameters passed to the loggers methods.

<a id="consoletransportapi"></a>
### ConsoleTransport(options)

### format

A format used to stringify the parameters passed to the loggers methods.

### stderrLevels

<a id="simpleformatapi"></a>
## SimpleFormat([options])

<a id="jsonformatapi"></a>
## JsonFormat([options])