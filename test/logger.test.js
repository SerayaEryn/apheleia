'use strict'

const { test, tearDown } = require('tap')
const { createLogger } = require('..')
const RotatingStream = require('daily-rotating-file-stream')
const fs = require('fs')

const files = []
var count = 0

tearDown(() => {
  files.forEach((file) => {
    try {
      fs.unlinkSync(file)
    } catch (e) {
      console.log(e)
    }
  })
})

test('', (t) => {
  runTests(t.test)
  t.end()
})

function runTests (test) {
  test('should not log with level debug', (t) => {
    t.plan(1)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    logger.debug('test test test')
    logger.end(() => {
      const log = fs.readFileSync(fileName).toString()
      t.equals(log, '')
    })
  })

  test('should log with level info', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    logger.info('test test test')
    logger.end(() => {
      const buffer = fs.readFileSync(fileName)
      t.ok(buffer.toString().includes('INFO'))
      t.ok(buffer.toString().endsWith('test test test\n'))
    })
  })

  test('should log with level warn', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    logger.warn('test test test')
    logger.end(() => {
      const buffer = fs.readFileSync(fileName)
      t.ok(buffer.toString().includes('WARN'))
      t.ok(buffer.toString().endsWith('test test test\n'))
    })
  })

  test('should log with level error', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    logger.error('test test test')
    logger.end(() => {
      const buffer = fs.readFileSync(fileName)
      t.ok(buffer.toString().includes('ERROR'))
      t.ok(buffer.toString().endsWith('test test test\n'))
    })
  })

  test('should log stack', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    logger.error('test test test', new Error('booom'))
    logger.end(() => {
      const log = fs.readFileSync(fileName).toString()
      t.ok(log.includes('ERROR'))
      t.ok(log.includes('test test test\nError: booom\n'))
    })
  })

  test('should log stack with child', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })

    const child = logger.child({ test: '42' })

    child.error('test test test', new Error('booom'))
    logger.end(() => {
      const log = fs.readFileSync(fileName).toString()
      t.ok(log.includes('ERROR'))
      t.ok(log.includes('test test test test=42\nError: booom\n'))
    })
  })

  test('should use child logger', (t) => {
    t.plan(2)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })
    const child = logger.child({ test: '42' })

    child.info('test test test')
    logger.end(() => {
      const log = fs.readFileSync(fileName).toString()
      t.ok(log.includes('INFO'))
      t.ok(log.endsWith('test test test test=42\n'))
    })
  })

  test('should use child logger', (t) => {
    t.plan(3)
    const fileName = getFile()
    const logger = createLogger({
      stream: new RotatingStream({ fileName })
    })
    const child = logger.child({ test: '42' })

    child.end(() => {
      t.pass()
      logger.info('test test test')
      logger.end(() => {
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('INFO'))
        t.ok(log.endsWith('test test test\n'))
      })
    })
  })
}

function getFile () {
  const file = `${__dirname}/console${count++}.log`
  files.push(file)
  return file
}
