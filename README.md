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
const { createLogger } = require('apheleia')

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
* [Benchmarks](#benchmarks)

## Transports

Transports are a combination of a stream and a format.<br>
There are two built-in transports: `Transport` and `ConsoleTransport`.

### Transport

```js
const { Transport, JsonFormat } = require('apheleia')

const transport = new Transport({
  stream: fs.createWriteStream('/dev/null'),
  format: new JsonFormat()
}
```

### ConsoleTransport

The `ConsoleTransport` is a transport that logs to `stdout` and `stderr`.<br>
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

Child loggers allow to create loggers with additional information; for example an id of a request or the name of a module.<br>
The provided additional information will be included every time a logging functions is being called on the child logger.

```js
const child = parentLogger.child({ requestId: 'abcd' })
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
#### stream (optional)
A Writable stream. If `undefined` a `ConsoleTransport` will be used.

#### format (optional)

A format. Defaults to an instance of `SimpleFormat`.<br>

#### level (optional)

Sets the log level of the logger. <br>
Default: `INFO`

#### transports (optional)

Allows to set the transport of the logger.

### Logger

The logger supports the following levels: `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR` & `FATAL`
The logger provides a logging method for each level:

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

#### stderrLevels

<a id="simpleformatapi"></a>
### SimpleFormat([options])

<a id="jsonformatapi"></a>
### JsonFormat([options])

## Benchmarks

### Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 5393 ms  |
| Pino                 | 2171 ms  |
| Apheleia             | 2083 ms  |
| Pino - Extreme       | 994 ms   |      
| Apheleia - SonicBoom | 674 ms   |

### Non-Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 5359 ms  |
| Apheleia             | 2469 ms  |
| Apheleia - SonicBoom | 1078 ms  |

### Child Logging

| Logger               | Duration |
|----------------------|----------|
| Winston              | 6067 ms  |
| Pino                 | 2307 ms  |
| Apheleia             | 2190 ms  |
| Pino - Extreme       | 1088 ms  |      
| Apheleia - SonicBoom | 748 ms   |

### Child Creation

| Logger               | Duration |
|----------------------|----------|
| Winston              | 995 ms   |
| Pino                 | 918 ms   |
| Apheleia             | 367 ms   |

## License

[MIT](./LICENSE)