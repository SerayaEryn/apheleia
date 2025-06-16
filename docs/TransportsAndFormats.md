# Transports

Transports are a combination of a stream and a format.<br>
There are two built-in transports: `Transport` and `ConsoleTransport`.

## Transport

```js
import { Transport, JsonFormat } from 'apheleia'

const transport = new Transport({
  stream: fs.createWriteStream('/dev/null'),
  format: new JsonFormat()
}
```

## ConsoleTransport

The `ConsoleTransport` is a transport that logs to `stdout` and `stderr`.<br>
Levels being logged to stdout: `TRACE`, `DEBUG`, `INFO`<br>
Levels being logged to stderr: `WARN`, `ERROR`, `FATAL`
```js
import { ConsoleTransport, JsonFormat } from 'apheleia'

const transport = new ConsoleTransport({
  format: new JsonFormat()
}
```

# Formats

A format stringifies the parameters passed to the loggers methods in a certain way.

There are two formats provided by `apheleia`: `JsonFormat` and `SimpleFormat`.

Custom formats can be created by implementing the following interface: 
```ts
interface Format {
  transform (level: string, message: string, args: any[], meta: object | undefined): string
  formatMetaDataObject (meta: object): string
  formatMetaData (key: string, value: any): string {
}
```
