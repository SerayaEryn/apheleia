# apheleia

[![Build Status](https://travis-ci.org/SerayaEryn/apheleia.svg?branch=master)](https://travis-ci.org/SerayaEryn/apheleia)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/apheleia/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/apheleia?branch=master)
[![NPM version](https://img.shields.io/npm/v/apheleia.svg?style=flat)](https://www.npmjs.com/package/apheleia)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A fast and simplistic logger supporting any Writable stream and custom formats.

## Installation

```bash
npm i apheleia
```

## Usage

```js
const { createLogger } = require('.')

const logger = createLogger()
logger.info('hello world')

const child = logger.child({ requestId: 'abcd' })
child.info('hello world')
```

This logs the following lines:
```
2019-04-19T09:23:50.902Z INFO hello world
2019-04-19T09:23:50.902Z INFO hello world requestId=abcd
```

## Documentation

* [Transports](#transports)
* [Formats](#formats)
* [Child Loggers](#child-loggers)
* [API](#api)

## Transports

Transports are a combination of a stream and a format.
`apheleia` provides two transports: `Transport` and `ConsoleTransport`.

### Transport

```js
const { Transport, JsonFormat } = require('apheleia')

const transport = new Transport({
  stream: fs.createWriteStream('/dev/null'),
  format: new JsonFormat()
}
```

### ConsoleTransport

The `ConsoleTransport` is a transport that logs to stdout and stderr.<br>
Levels being logged to stdout: `TRACE`, `DEBUG`, `INFO`<br>
Levels being logged to stderr: `WARN`, `ERROR`, `FATAL`
```js
const { Transport, JsonFormat } = require('apheleia')

const transport = new ConsoleTransport({
  format: new JsonFormat()
}
```

## Formats

A format stringifies the parameters passed to the loggers methods in a certain way.

There are two formats provided by `apheleia`: `JsonFormat` and `SimpleFormat`.

Custom formats can be created by implementing the following interface: 
```ts
interface Format {
  transform (level: string, message: string, args: any[], meta: object | undefined): string
}
```

## Child Loggers

```js
const child = parentLogger.child({ child: true })
child.info('hello world!')
```

## API

* [createLogger([options]): Logger](#createlogger)
* [Logger](#logger)
* [Transport(options)](#transportapi)
* [ConsoleTransport(options)](#consoletransportapi)
* [SimpleFormat([options])](#simpleformatapi)
* [JsonFormat([options])](#jsonformatapi)

<a id="createlogger"></a>
### createLogger([options]): Logger
Creates a new Logger instance.

```js
const { createLogger, SimpleFormat } = require('apheleia')
const fs = require('fs')

const logger = createLogger({
  stream: fs.createWriteStream(__dirname + '/app.log'),
  format: new SimpleFormat()
})
logger.info('hello world')
```
#### stream (optional)
A Writable stream. If `undefined` a `ConsoleTransport` will be used.

#### format (optional)

A format. Defaults to an instance of `SimpleFormat`.<br>

#### level (optional)

Sets the log level of the logger. <br>
Default: `INFO`

#### levels (optional)
The levels used by the logger.<br>
Default: `{ TRACE: 10, DEBUG: 20, INFO: 30, WARN: 40, ERROR: 50, FATAL: 60 }`

#### transports (optional)

Allows to set the transport of the logger.

### Logger

The logger provides a logging method for each level.<br>
If the default levels are being used the following logging methods will be available:

#### Logger#trace(message: string, ...args): void
Writes a `TRACE` level log, if allowed by the `level` option.
#### Logger#debug(message: string, ...args): void
Writes a `DEBUG` level log, if allowed by the `level` option.
#### Logger#info(message: string, ...args): void
Writes a `INFO` level log, if allowed by the `level` option.
#### Logger#warn(message: string, ...args): void
Writes a `WARN` level log, if allowed by the `level` option.
#### Logger#error(message: string, ...args): void
Writes a `ERROR` level log, if allowed by the `level` option.
#### Logger#fatal(message: string, ...args): void
Writes a `FATAL` level log, if allowed by the `level` option.

#### Logger#child(meta: object): Logger

Creates a child logger with additional data.

#### Logger#end(): Promise\<void>

Ends the logger by calling `end()` on every transport. Returns a Promise.

<a id="transportapi"></a>
### Transport(options)

Creates a new Transport instance.

```js
new Transport({
  stream: fs.createWriteStream('/dev/null'),
  format: new SimpleFormat()
}
```

#### stream

#### format

<a id="consoletransportapi"></a>
### ConsoleTransport(options)

#### format

A format used to stringify the parameters passed to the loggers methods.

<a id="simpleformatapi"></a>
### SimpleFormat([options])

<a id="jsonformatapi"></a>
### JsonFormat([options])

## License

[MIT](./LICENSE)