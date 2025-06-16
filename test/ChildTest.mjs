import test from 'ava'
import { createLogger } from '../lib/Apheleia.mjs'
import fs from 'fs'
import { join } from 'path'

const files = []
let count = 50

test.after.always(() => {
  files.forEach((file) => {
    try {
      fs.unlinkSync(file)
    } catch (e) {
      console.log(e)
    }
  })
})

function getFile () {
  const file = join(import.meta.dirname, `/console${count++}.log`)
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
  t.truthy(log.includes('ERROR'))
  t.truthy(log.includes('test test test test=42\nError: booom\n'))
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
  t.truthy(log.includes('INFO'))
  t.truthy(log.endsWith('test test test test=42\n'))
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
  t.truthy(log.includes('INFO'))
  t.truthy(log.endsWith('test test test test=42 country=DE\n'))
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

  t.true(log.includes('INFO'))
  t.log(log)
  t.truthy(log.endsWith('test test test\n'))
  t.truthy(!log.includes('test=42'))
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
  t.truthy(log.includes('INFO'))
  t.log(log)
  console.log(log)
  t.truthy(log.endsWith('test test test requestId=42 country=DE\n'))
})
