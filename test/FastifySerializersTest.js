'use strict'

const test = require('ava')
const Fastify = require('fastify')
const { createLogger, JsonFormat } = require('..')
const request = require('request')
const Writable = require('stream').Writable

test.cb('should serialze response and request - json', (t) => {
  t.plan(3)

  let log = ''
  class StringStream extends Writable {
    constructor () {
      super({
        write (chunk, encoding, callback) {
          log += chunk
          callback(null)
        }
      })
    }
  }

  const logger = createLogger({
    format: new JsonFormat(),
    stream: new StringStream()
  })

  const server = Fastify({ logger })
  server.get('/', async (request, reply) => {
    reply.send('hello world')
  })
  server.listen(0, () => {
    server.server.unref()
    const port = server.server.address().port
    request({
      method: 'GET',
      uri: 'http://localhost:' + port + '/',
      headers: {
        'x-test': 'hello world'
      }
    }, (err, response, body) => {
      t.falsy(err)
      t.true(/.*,"req":{"method":"GET","url":"\/","hostname":.*,"remoteAddress":.*,"remotePort":.*/.test(log))
      t.true(/.*,"res":{"statusCode":200}.*/.test(log))
      t.log(log)
      t.end()
    })
  })
})

test.cb('should serialze response and request - simple', (t) => {
  t.plan(3)

  let log = ''
  class StringStream extends Writable {
    constructor () {
      super({
        write (chunk, encoding, callback) {
          log += chunk
          callback(null)
        }
      })
    }
  }

  const logger = createLogger({
    stream: new StringStream()
  })

  const server = Fastify({ logger })
  server.get('/', async (request, reply) => {
    reply.send('hello world')
  })
  server.listen(0, () => {
    server.server.unref()
    const port = server.server.address().port
    request({
      method: 'GET',
      uri: 'http://localhost:' + port + '/',
      headers: {
        'x-test': 'hello world'
      }
    }, (err, response, body) => {
      t.falsy(err)
      t.true(/.* method=GET url=\/ hostname=.* remoteAddress=.* remotePort=.*/.test(log))
      t.true(/.* statusCode=200.*/.test(log))
      t.log(log)
      t.end()
    })
  })
})
