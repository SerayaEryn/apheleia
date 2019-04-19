
'use strict'

const benchmark = require('fastbench')
const winston = require('winston')
const fs = require('fs')
const { createLogger, JsonFormat } = require('..')
const RotatingTransport = require('fast-file-rotate')
const RotatingStream = require('daily-rotating-file-stream')
const pino = require('pino')

const pinoLogger = pino(fs.createWriteStream('/dev/null'))
const pinoExtreme = pino(pino.extreme('/dev/null'))

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
      format: winston.format.simple()
    })
  ]
})
const winstonLogger2 = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: new RotatingTransport({ fileName: '/dev/null' })
    })
  ],
  format: winston.format.simple()
})
const apheleiaLogger = createLogger({
  stream: fs.createWriteStream('/dev/null')
})
const logger2 = createLogger({
  stream: new RotatingStream({ fileName: '/dev/null' })
})

const apheleiaLoggerJson = createLogger({
  stream: fs.createWriteStream('/dev/null'),
  format: new JsonFormat()
})

const logger4 = createLogger({
  stream: new RotatingStream({ fileName: '/dev/null' }),
  format: new JsonFormat()
})

const run = benchmark([
  function benchWinston (cb) {
    for (let i = 0; i < 10; i++) {
      winstonLogger.info('hello world')
    }
    setImmediate(cb)
  },
  function benchWinstonFastFileRotate (cb) {
    for (let i = 0; i < 10; i++) {
      winstonLogger2.info('hello world')
    }
    setImmediate(cb)
  },
  function benchApheleia (cb) {
    for (let i = 0; i < 10; i++) {
      apheleiaLogger.info('hello world')
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
  function benchApheleiaDailyRotatingFileStream (cb) {
    for (let i = 0; i < 10; i++) {
      logger2.info('hello world')
    }
    setImmediate(cb)
  },
  function benchPinoExtreme (cb) {
    for (let i = 0; i < 10; i++) {
      pinoExtreme.info('hello world')
    }
    setImmediate(cb)
  },
  function benchApheleiaJsonDailyRotatingFileStream (cb) {
    for (let i = 0; i < 10; i++) {
      logger4.info('hello world')
    }
    setImmediate(cb)
  }
], 100000)

run(run)
