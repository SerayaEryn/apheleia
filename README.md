# apheleia

[![Build Status](https://travis-ci.org/SerayaEryn/apheleia.svg?branch=master)](https://travis-ci.org/SerayaEryn/apheleia)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/apheleia/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/apheleia?branch=master)
[![NPM version](https://img.shields.io/npm/v/apheleia.svg?style=flat)](https://www.npmjs.com/package/apheleia)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A simplistic logger supporting any Writable stream and custom formats.

## Installation

```bash
npm i apheleia
```

## API

### createLogger([options])
Creates a new Logger instance with a single transport.

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
A Writable stream. If undefined a `ConsoleTransport` will be used.

#### format (optional)

A format. Defaults to a instance of `SimpleFormat`.<br>
Formats must implement the following interface: 
```ts
interface Format {
  transform (level: string, message: string, args: any[], meta: object | undefined)
}
```

#### levels (optional)
The levels used by the logger.

#### level (optional)
Sets the log level of the logger.

### SimpleFormat([options])

### Logger(options)

Creates a new Logger instance.

```js
new Logger({
  transports: [
    new Transport({
      stream: process.stdout,
      format: new SimpleFormat()
    }
  ],
  levels: {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
  },
  level: 'DEBUG'
})
```

#### transports

An array of transports.

#### levels (optional)
The levels used by the logger.
Defaults to :
```js
{
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  FATAL: 5
}
```

#### level (optional)
Sets the log level of the logger.

### Logger#end(callback)

Ends the logger by calling `end()` on every transport and then calls the `callback`.

### Logger#trace(message, ...args)
Writes a `TRACE` level log, if allowed by the `level` option.
### Logger#debug(message, ...args)
Writes a `DEBUG` level log, if allowed by the `level` option.
### Logger#info(message, ...args)
Writes a `INFO` level log, if allowed by the `level` option.
### Logger#warn(message, ...args)
Writes a `WARN` level log, if allowed by the `level` option.
### Logger#error(message, ...args)
Writes a `ERROR` level log, if allowed by the `level` option.
### Logger#fatal(message, ...args)
Writes a `FATAL` level log, if allowed by the `level` option.

### Transport(options)

Creates a new Transport instance.

```js
new Transport({
  stream: process.stdout,
  format: new SimpleFormat()
}
```
#### format

A format used to stringify the parameters passed to the loggers methods.

#### level
Sets the log level of the logger.

### ConsoleTransport(options)

#### format

A format used to stringify the parameters passed to the loggers methods.

## License

[MIT](./LICENSE)