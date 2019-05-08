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
The logger provides a logging method for each level.

Each logging method accepts a `message` and any number of further arguments to be logged. For example errors or objects.

```js
logger.info('a message')
logger.error('something went wrong', error)
logger.debug('debug', { property: '42'})
logger.log({ level: 'INFO', message: 'hello world' })
```

### Logger#trace([object], [message], [...metaInformation])
Writes a `TRACE` level log, if allowed by the `level` option.

### Logger#debug([object], [message], [...metaInformation])
Writes a `DEBUG` level log, if allowed by the `level` option.

### Logger#info([object], [message], [...metaInformation])
Writes a `INFO` level log, if allowed by the `level` option.

### Logger#warn([object], [message], [...metaInformation])
Writes a `WARN` level log, if allowed by the `level` option.

### Logger#error([object], [message], [...metaInformation])
Writes a `ERROR` level log, if allowed by the `level` option.

### Logger#fatal([object], [message], [...metaInformation])
Writes a `FATAL` level log, if allowed by the `level` option.

### Logger#log([object], [message], [...metaInformation])

Writes a log using the `level` provided by the `object`, if allowed by 
the `level` option.

```js
logger.log({ level: 'INFO', message: 'hello world' })
logger.log({ level: 'INFO' }, 'hello world')
```

### Logger#child(meta): Logger

Creates a child logger with additional data.

Child loggers allow to create loggers with additional information; for 
example an id of a request or the name of a module.<br>
The provided additional information will be included every time a logging 
functions is being called on the child logger.

```js
const { createLogger } = require('apheleia')
const parentLogger = createLogger()

const child = parentLogger.child({ requestId: 'abcd' })
child.info('hello world!')
```

### Logger#getLevel()

Returns the current level of the logger as a string.

### Logger#setLevel(level)

Changes the level to the passed `level`.

### Logger#isLevelEnabled(level)

Allows to check if a `level` is enabled.

### Logger#end()

Ends the logger by calling `end()` on every transport. Returns a Promise.

### Logger#addMetaData (key, value)

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

The `SimpleFormat` formats the arguments using the following format: `date level message meta`

Example:

```
2019-04-19T09:23:50.902Z INFO hello world
2019-04-19T09:23:50.902Z INFO hello world requestId=abcd
```

<a id="jsonformatapi"></a>
## JsonFormat([options])
