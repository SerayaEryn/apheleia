'use strict'

const { test, tearDown } = require('tap')
const { Transport } = require('../lib/Apheleia')

test('', (t) => {
  t.plan(1)
  class TestFormat {}
  const transport = new Transport({ format: new TestFormat() })

  const preparedMeta = transport.prepareMeta({ test: 42 })

  t.deepEquals(preparedMeta, { test: 42 })
})
