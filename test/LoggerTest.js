'use strict'

const test = require('ava')
const { createLogger } = require('../lib/Apheleia')
const fs = require('fs')

const files = []
var count = 0

test.after.always(() => {
  files.forEach((file) => {
    try {
      fs.unlinkSync(file)
    } catch (e) {
      console.log(e)
    }
  })
})

test.serial('should not log with level debug', async (t) => {
  t.plan(1)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.debug('test test test')
  await logger.end()
  if (fs.existsSync(fileName)) {
    const log = fs.readFileSync(fileName).toString()
    t.is(log, '')
  } else {
    t.pass()
  }
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
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should ignore null object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.info(null, 'test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should ignore boolean object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.info(true, 'test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should use level from object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.log({ level: 'INFO' }, 'test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.log(buffer.toString())
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should use level INFO if object provides to level', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.log({}, 'test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.log(buffer.toString())
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should use message from object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.log({ level: 'INFO', message: 'test test test' })
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.log(buffer.toString())
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
})

test('should log meta data from object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.log({ level: 'INFO', message: 'test test test', test: 42 })
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.log(buffer.toString())
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test test=42\n'))
})

test('should add meta data', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  logger.addMetaData('test', 42)

  logger.info('test test test')
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test test=42\n'))
})

test('should reformat meta data after adding meta data', async (t) => {
  t.plan(5)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  logger.addMetaData('test', 42)
  logger.info('test test test')

  logger.addMetaData('test', 43)
  logger.addMetaData('test2', 42)
  logger.info('test test test')

  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  const lines = log.split('\n')
  t.truthy(lines[0].includes('INFO'))
  t.truthy(lines[0].endsWith('test test test test=42'))
  t.truthy(lines[1].includes('INFO'))
  t.truthy(lines[1].endsWith('test test test test=43 test2=42'))
  t.is(lines[2], '')
})

test('should log with level info and include object', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  logger.info('test test test', 'something', { test: 42 }, () => {})
  await logger.end()
  const buffer = fs.readFileSync(fileName)
  t.log(buffer.toString())
  t.truthy(buffer.toString().includes('INFO'))
  t.truthy(buffer.toString().endsWith('test test test something test=42\n'))
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
  t.truthy(buffer.toString().includes('WARN'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
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
  t.truthy(buffer.toString().includes('ERROR'))
  t.truthy(buffer.toString().endsWith('test test test\n'))
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
  t.truthy(log.includes('ERROR'))
  t.truthy(log.includes('test test test\nError: booom\n'))
})

test.cb('should log with level trace to stdout', (t) => {
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
        t.truthy(log.includes('TRACE'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test.cb('should log with level debug to stdout', (t) => {
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
        t.truthy(log.includes('DEBUG'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test.cb('should log with level info to stdout', (t) => {
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
        t.truthy(log.includes('INFO'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test.cb('should log with level warn to stderr', (t) => {
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
        t.truthy(log.includes('WARN'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test.cb('should log with level error to stderr', (t) => {
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
        t.truthy(log.includes('ERROR'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test.cb('should log with level fatal to stderr', (t) => {
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
        t.truthy(log.includes('FATAL'))
        t.truthy(log.endsWith('test test test\n'))
        t.end()
      })
  })
  stream.end()
})

test('should return level', (t) => {
  t.plan(1)
  const logger = createLogger()

  const level = logger.getLevel()

  t.is('INFO', level)
})

test('should be able to change level', (t) => {
  t.plan(1)
  const logger = createLogger()

  logger.setLevel('TRACE')
  const level = logger.getLevel()

  t.is('TRACE', level)
})

test('should throw if trying to change to unknown level', (t) => {
  t.plan(1)
  const logger = createLogger()

  try {
    logger.setLevel('TEST')
  } catch (error) {
    t.is(error.code, 'APH_ERR_UNKNOWN_LEVEL')
  }
})

function getFile () {
  const file = `${__dirname}/console${count++}.log`
  files.push(file)
  return file
}
