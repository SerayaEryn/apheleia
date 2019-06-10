'use strict'

const test = require('ava')
const { Transport } = require('../lib/Apheleia')

test('should call format.formatMetaData()', (t) => {
  t.plan(1)
  const format = {
    formatMetaData () {
      t.pass()
    }
  }
  const transport = new Transport({ format })

  transport.formatMetaData()
})
