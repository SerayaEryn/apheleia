'use strict'

const test = require('ava')
const { JsonFormat } = require('../lib/Apheleia')

test('simple message', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [])

  t.truthy(/{"time":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('simple message with timestamp caching', (t) => {
  t.plan(1)
  const format = new JsonFormat({ fastTimestamp: true })

  const line = format.transform('INFO', 'hello world!', [])

  t.truthy(/{"time":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #1', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: 42 }], '')

  t.truthy(/{"time":\d{13},"level":30,"test":42,"msg":"hello world!"}/.test(line))
})

test('object arg #2', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test2: true, test3: 'test' }], '')

  t.truthy(/{"time":\d{13},"level":30,"test2":true,"test3":"test","msg":"hello world!"}/.test(line))
})

test('object arg #3', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test3: 'test' }], '')

  t.truthy(/{"time":\d{13},"level":30,"test3":"test","msg":"hello world!"}/.test(line))
})

test('object arg #4', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: () => { } }], '')

  t.truthy(/{"time":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #5', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: undefined }], '')

  t.truthy(/{"time":\d{13},"level":30,"msg":"hello world!"}/.test(line))
})

test('object arg #6', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', [{ test: { test: 42 } }], '')

  t.truthy(/{"time":\d{13},"level":30,"test":{"test":42},"msg":"hello world!"}/.test(line))
})

test('non object args', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('INFO', 'hello world!', ['test', null, undefined, () => { }], '')

  t.truthy(/{"time":\d{13},"level":30,"msg":"hello world! test"}/.test(line))
})

test('error with code', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const errorWithCode = new Error('booom')
  errorWithCode.code = 'A_CODE'
  const line = format.transform('ERROR', 'hello world!', [errorWithCode], '')

  t.truthy(/{"time":\d{13},"level":50,"msg":"hello world!","error":"Error: booom.*","code":"A_CODE"}/.test(line))
})

test('error', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const line = format.transform('ERROR', 'hello world!', [new Error('booom')], '')

  t.truthy(/{"time":\d{13},"level":50,"msg":"hello world!","error":"Error: booom.*"}/.test(line))
})

test('should prepare meta', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.formatMetaDataObject({ test: 42 })

  t.is(partialLine, ',"test":42')
})

test('should prepare undefined meta', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.formatMetaDataObject()

  t.is(partialLine, '')
})

test('should ignore level property', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.formatMetaDataObject({ level: 42 })

  t.is(partialLine, '')
})

test('should ignore message property', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.formatMetaDataObject({ message: 42 })

  t.is(partialLine, '')
})

test('should ignore serializers property', (t) => {
  t.plan(1)
  const format = new JsonFormat()

  const partialLine = format.formatMetaDataObject({ serializers: 42 })

  t.is(partialLine, '')
})

test('should not ignore serializers property', (t) => {
  t.plan(1)
  const format = new JsonFormat({ ignoreFastifyProperties: false })

  const line = format.formatMetaDataObject({ serializers: 42 })

  t.is(line, ',"serializers":42')
})
