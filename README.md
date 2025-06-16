# apheleia

![Build Status](https://github.com/SerayaEryn/apheleia/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/apheleia/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/apheleia?branch=master)
[![NPM version](https://img.shields.io/npm/v/apheleia.svg?style=flat)](https://www.npmjs.com/package/apheleia)

Fast and simplistic logger supporting any Writable stream and custom formats.

## Installation

```bash
npm i apheleia
```

## Usage

```js
import { createLogger } from 'apheleia'

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

* [API](https://github.com/SerayaEryn/apheleia/blob/master/docs/API.md)
* [Benchmarks](https://github.com/SerayaEryn/apheleia/blob/master/docs/Benchmarks.md)
* [Transports & Formats](https://github.com/SerayaEryn/apheleia/blob/master/docs/TransportsAndFormats.md)

## License

[MIT](./LICENSE)
