'use strict'

const fs = require('fs')

module.exports = function child (suite) {
  suite.add(
    'messageOnly',
    (module, logger) => {
      return {
        defer: true,
        fn: function (deferred) {
          for (var i = 0; i < 20; i++) {
            logger.info('a message')
          }
          deferred.resolve()
        }
      }
    },
    { setup: setup() }
  )
  suite.add(
    'smallObject',
    (module, logger) => {
      return {
        defer: true,
        fn: function (deferred) {
          for (var i = 0; i < 20; i++) {
            logger.info('a message', { test: 42 })
          }
          deferred.resolve()
        }
      }
    },
    { setup: setupChild() }
  )
}

function setup () {
  return (module) => module.createLogger({
    stream: fs.createWriteStream('/dev/null')
  })
}

function setupChild () {
  return (module) => module.createLogger({
    stream: fs.createWriteStream('/dev/null')
  }).child({ test: 42 })
}
