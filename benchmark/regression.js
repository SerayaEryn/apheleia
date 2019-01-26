'use strict'

const createRegressionBenchmark = require('@clevernature/benchmark-regression')

const currentLogger = require('..')
const benchmarks = createRegressionBenchmark(currentLogger, [
  'apheleia@latest'
])

benchmarks.suite('logger', require('./logger'))
benchmarks.suite('child', require('./child'))
benchmarks.run()
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
