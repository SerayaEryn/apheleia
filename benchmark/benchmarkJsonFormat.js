'use strict'

const bench = require('fastbench')
const fs = require('fs')
const { createLogger, JsonFormat } = require('../lib/Apheleia')
const pino = require('pino')
const SonicBoom = require('sonic-boom')
const winston = require('winston')

const pinoLogger = pino(fs.createWriteStream('/dev/null'))
const pinoExtreme = pino(pino.destination({ sync: false, dest: '/dev/null' }))

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
  stream: new SonicBoom({ dest: '/dev/null', minLength: 0, sync: false }),
  format: new JsonFormat()
})

module.exports = function jsonFormat () {
  return new Promise((resolve) => {
    const run = bench([
      function benchWinston (cb) {
        for (let i = 0; i < 10; i++) {
          winstonLogger.info('hello world')
        }
        setImmediate(cb)
      },
      function benchPino (cb) {
        for (let i = 0; i < 10; i++) {
          pinoLogger.info('hello world')
        }
        setImmediate(cb)
      },
      function benchApheleiaJson (cb) {
        for (let i = 0; i < 10; i++) {
          apheleiaLoggerJson.info('hello world')
        }
        setImmediate(cb)
      },
      function benchPinoExtreme (cb) {
        for (let i = 0; i < 10; i++) {
          pinoExtreme.info('hello world')
        }
        setImmediate(cb)
      },
      function benchApheleiaJsonSonicBoom (cb) {
        for (let i = 0; i < 10; i++) {
          apheleiaLoggerJsonSonicBoom.info('hello world')
        }
        setImmediate(cb)
      }
    ], 100000)
    console.log('\nJsonFormat:\n')
    run(resolve)
  })
}
