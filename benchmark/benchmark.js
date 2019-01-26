
'use strict'

const Benchmark = require('benchmark')
const winston = require('winston')
const fs = require('fs')
const { createLogger } = require('..')
const RotatingTransport = require('fast-file-rotate')
const RotatingStream = require('daily-rotating-file-stream')

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
const logger = createLogger({
  stream: fs.createWriteStream('/dev/null')
})
const logger2 = createLogger({
  stream: new RotatingStream({ fileName: '/dev/null' })
})

new Benchmark.Suite()
  .add('winston', {
    defer: true,
    fn: function (deferred) {
      for (var i = 0; i < 20; i++) {
        winstonLogger.log('info', 'hello world')
      }
      deferred.resolve()
    }
  })
  .add('winston - fast-file-rotate', {
    defer: true,
    fn: function (deferred) {
      for (var i = 0; i < 20; i++) {
        winstonLogger2.log('info', 'hello world')
      }
      deferred.resolve()
    }
  })
  .add('apheleia', {
    defer: true,
    fn: function (deferred) {
      for (var i = 0; i < 20; i++) {
        logger.info('hello world')
      }
      deferred.resolve()
    }
  })
  .add('apheleia - daily-rotating-file-stream', {
    defer: true,
    fn: function (deferred) {
      for (var i = 0; i < 20; i++) {
        logger2.info('hello world')
      }
      deferred.resolve()
    }
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run()
