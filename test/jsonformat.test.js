'use strict'

const { test } = require('tap')
const { JsonFormat } = require('..')

test('simple message', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [])

  t.ok(/{"timestamp":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #1', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: 42 }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"test":42,"msg":"hello world!"}/.test(line))
})

test('object arg #2', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test2: true, test3: 'test' }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"test2":true,"test3":"test","msg":"hello world!"}/.test(line))
})

test('object arg #3', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test3: 'test' }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"test3":"test","msg":"hello world!"}/.test(line))
})

test('object arg #4', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: () => { } }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #5', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: undefined }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #6', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: { test: 42 } }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"test":{"test":42},"msg":"hello world!"}/.test(line))
})

test('non object args', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [true, 1, 'test', null, undefined, () => { }], '')

  t.ok(/{"timestamp":\d{13},"level":30,"msg":"hello world! true 1 test"}/.test(line))
})

test('error with code', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const errorWithCode = new Error('booom')
  errorWithCode.code = 'A_CODE'
  const line = format.transform('ERROR', 'hello world!', [errorWithCode], '')

  t.ok(/{"timestamp":\d{13},"level":50,"msg":"hello world!","error":"Error: booom.*","code":"A_CODE"}/.test(line))
})

test('error', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('ERROR', 'hello world!', [new Error('booom')], '')

  t.ok(/{"timestamp":\d{13},"level":50,"msg":"hello world!","error":"Error: booom.*"}/.test(line))
})

test('should prepare meta', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.prepareMeta({ test: 42 })

  t.equals(partialLine, ',"test":42')
})

test('should prepare undefined meta', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.prepareMeta()

  t.equals(partialLine, '')
})
