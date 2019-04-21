'use strict'

const { test, tearDown } = require('tap')
const { createLogger } = require('../lib/Apheleia')
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

test('should not log with level debug', async (t) => {
  t.plan(1)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.debug('test test test')
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.equals(log, '')
})

test('should log with level info', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.info('test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.ok(buffer.toString().includes('INFO'))
  t.ok(buffer.toString().endsWith('test test test\n'))
})

test('should log with level info', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.info('test test test', 'something', { test: 42 }, () => {})
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.ok(buffer.toString().includes('INFO'))
  t.ok(buffer.toString().endsWith('test test test something\n{"test":42}\n'))
})

test('should log with level warn', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.warn('test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.ok(buffer.toString().includes('WARN'))
  t.ok(buffer.toString().endsWith('test test test\n'))
})

test('should log with level error', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.error('test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.ok(buffer.toString().includes('ERROR'))
  t.ok(buffer.toString().endsWith('test test test\n'))
})

test('should log stack', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.error('test test test', new Error('booom'))
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.ok(log.includes('ERROR'))
  t.ok(log.includes('test test test\nError: booom\n'))
})

test('should log with level trace to stdout', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({
    level: 'TRACE'
  })

  const originalWrite = process.stdout.write
  const stream = fs.createWriteStream(fileName)
  process.stdout.write = stream.write.bind(stream)

  logger.trace('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stdout.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('TRACE'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should log with level debug to stdout', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({
    level: 'TRACE'
  })

  const originalWrite = process.stdout.write
  const stream = fs.createWriteStream(fileName)
  process.stdout.write = stream.write.bind(stream)

  logger.debug('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stdout.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('DEBUG'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should log with level info to stdout', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({
    level: 'TRACE'
  })

  const originalWrite = process.stdout.write
  const stream = fs.createWriteStream(fileName)
  process.stdout.write = stream.write.bind(stream)

  logger.info('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stdout.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('INFO'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should log with level warn to stderr', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({})

  const originalWrite = process.stderr.write
  const stream = fs.createWriteStream(fileName)
  process.stderr.write = stream.write.bind(stream)

  logger.warn('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stderr.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('WARN'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should log with level error to stderr', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({
    level: 'TRACE'
  })

  const originalWrite = process.stderr.write
  const stream = fs.createWriteStream(fileName)
  process.stderr.write = stream.write.bind(stream)

  logger.error('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stderr.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('ERROR'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should log with level fatal to stderr', (t) => {
  t.plan(3)
  const fileName = getFile()
  const logger = createLogger({
    level: 'TRACE'
  })

  const originalWrite = process.stderr.write
  const stream = fs.createWriteStream(fileName)
  process.stderr.write = stream.write.bind(stream)

  logger.fatal('test test test')
  stream.on('finish', () => {
    logger.end()
      .then(() => {
        process.stderr.write = originalWrite
        t.pass('end cb called')
        const log = fs.readFileSync(fileName).toString()
        t.ok(log.includes('FATAL'))
        t.ok(log.endsWith('test test test\n'))
      })
  })
  stream.end()
})

test('should return level', (t) => {
  t.plan(1)
  const logger = createLogger()

  const level = logger.getLevel()

  t.equals('INFO', level)
})

test('should be able to change level', (t) => {
  t.plan(1)
  const logger = createLogger()

  logger.setLevel('TRACE')
  const level = logger.getLevel()

  t.equals('TRACE', level)
})

test('should throw if trying to change to unknown level', (t) => {
  t.plan(1)
  const logger = createLogger()

  try {
    logger.setLevel('TEST')
  } catch (error) {
    t.equals(error.code, 'APH_ERR_UNKNOWN_LEVEL')
  }
})

function getFile () {
  const file = `${__dirname}/console${count++}.log`
  files.push(file)
  return file
}
