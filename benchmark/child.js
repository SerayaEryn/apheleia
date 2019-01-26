'use strict'

module.exports = function child (suite) {
  suite.add(
    'creation',
    (module, logger) => {
      logger.child({ test: 42 })
    },
    { setup: setup() }
  )
  suite.add(
    'logging',
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
}

function setup () {
  return (module) => {
    return module.createLogger({})
  }
}
