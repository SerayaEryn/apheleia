
'use strict'

const benchmark = require('fastbench')
const winston = require('winston')
const fs = require('fs')
const { createLogger, SimpleFormat } = require('../lib/Apheleia')
const SonicBoom = require('sonic-boom')

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
      format: winston.format.simple()
    })
  ]
})
const apheleiaLogger = createLogger({
  stream: fs.createWriteStream('/dev/null'),
  format: new SimpleFormat()
})
const apheleiaLoggerSonicBoom = createLogger({
  stream: new SonicBoom({ dest: '/dev/null', minLength: 0, sync: false }),
  format: new SimpleFormat()
})

module.exports = function simpleFormat () {
  return new Promise((resolve) => {
    const run = benchmark([
      function benchWinston (cb) {
        for (let i = 0; i < 10; i++) {
          winstonLogger.info('hello world')
        }
        setImmediate(cb)
      },
      function benchApheleia (cb) {
        for (let i = 0; i < 10; i++) {
          apheleiaLogger.info('hello world')
        }
        setImmediate(cb)
      },
      function benchApheleiaSonicBoom (cb) {
        for (let i = 0; i < 10; i++) {
          apheleiaLoggerSonicBoom.info('hello world')
        }
        setImmediate(cb)
      }
    ], 100000)
    console.log('SimpleFormat:\n')
    run(resolve)
  })
}
