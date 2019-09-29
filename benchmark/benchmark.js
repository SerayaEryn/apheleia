'use strict'

const simpleFormat = require('./benchmarkSimpleFormat')
const jsonFormat = require('./benchmarkJsonFormat')
const childLogging = require('./benchmarkChildLogging')
const childChildLogging = require('./benchmarkChildChildLogging')
const childCreation = require('./benchmarkChildCreation')
const objectJsonFormat = require('./benchmarkObjectJsonFormat')

async function benchmark () {
  await simpleFormat()
  await jsonFormat()
  await childLogging()
  await childChildLogging()
  await childCreation()
  await objectJsonFormat()
}

benchmark()
