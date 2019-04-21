'use strict'

const { test, tearDown } = require('tap')
const { SimpleFormat } = require('../lib/Apheleia')

test('should handle undefined meta', (t) => {
  t.plan(1)
  const format = new SimpleFormat()

  const preparedMeta = format.prepareMeta()

  t.equals(preparedMeta, '')
})

test('simple message', (t) => {
  t.plan(1)
  const format = new SimpleFormat()

  const line = format.transform('INFO', 'hello world', [], undefined)

  t.ok(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line))
})

test('simple message with no timestamp caching', (t) => {
  t.plan(1)
  const format = new SimpleFormat({ fastTimestamp: false })

  const line = format.transform('INFO', 'hello world', [], undefined)

  t.ok(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line))
})
