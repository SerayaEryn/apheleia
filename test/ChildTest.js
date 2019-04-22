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

function getFile () {
  const file = `${__dirname}/console${count++}.log`
  files.push(file)
  return file
}

test('should log stack with child', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })

  const child = logger.child({ test: '42' })

  child.error('test test test', new Error('booom'))
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.ok(log.includes('ERROR'))
  t.ok(log.includes('test test test test=42\nError: booom\n'))
})

test('should use child logger', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  const child = logger.child({ test: '42' })

  child.info('test test test')
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.ok(log.includes('INFO'))
  t.ok(log.endsWith('test test test test=42\n'))
})

test('should add additional meta data to child logger', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  const child = logger.child({ test: '42' })

  child.addMetaData('country', 'DE')

  child.info('test test test')
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.ok(log.includes('INFO'))
  t.ok(log.endsWith('test test test test=42 country=DE\n'))
})

test('parent logger should remain functional', async (t) => {
  t.plan(4)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  const child = logger.child({ test: '42' })

  await child.end()
  t.pass()
  logger.info('test test test')
  await logger.end()
  const log = fs.readFileSync(fileName).toString()

  t.ok(log.includes('INFO'))
  t.ok(log.endsWith('test test test\n'))
  t.ok(!log.includes('test=42'))
})

test('should use child child logger', async (t) => {
  t.plan(2)
  const fileName = getFile()
  const logger = createLogger({
    stream: fs.createWriteStream(fileName)
  })
  const childChild = logger.child({ requestId: '42' }).child({ country: 'DE' })

  childChild.info('test test test')
  await logger.end()
  const log = fs.readFileSync(fileName).toString()
  t.ok(log.includes('INFO'))
  t.ok(log.endsWith('test test test requestId=42 country=DE\n'))
})
