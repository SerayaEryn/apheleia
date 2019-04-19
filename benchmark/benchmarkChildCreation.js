'use strict'

const bench = require('fastbench')
const fs = require('fs')
const { createLogger, JsonFormat } = require('../lib/Apheleia')
const pino = require('pino')
const SonicBoom = require('sonic-boom')
const winston = require('winston')

const pinoLogger = pino(fs.createWriteStream('/dev/null'))

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
      format: winston.format.json()
    })
  ]
})

const apheleiaLoggerJson = createLogger({
  stream: fs.createWriteStream('/dev/null'),
  format: new JsonFormat()
})

const apheleiaLoggerJsonSonicBoom = createLogger({
  stream: new SonicBoom('/dev/null', 16 * 1024),
  format: new JsonFormat()
})

const run = bench([
  function benchWinston (cb) {
    for (let i = 0; i < 10; i++) {
      winstonLogger.child({ module: 'test '})
    }
    setImmediate(cb)
  },
  function benchPino (cb) {
    for (let i = 0; i < 10; i++) {
      pinoLogger.child({ module: 'test '})
    }
    setImmediate(cb)
  },
  function benchApheleia (cb) {
    for (let i = 0; i < 10; i++) {
      apheleiaLoggerJson.child({ module: 'test '})
    }
    setImmediate(cb)
  }
], 100000)

run(run)
