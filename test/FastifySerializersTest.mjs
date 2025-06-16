import test from 'ava'
import Fastify from 'fastify'
import { createLogger, JsonFormat } from '../lib/Apheleia.mjs'
import request from 'request'
import { Writable } from 'stream'

test('should serialze response and request - json', async (t) => {
  return new Promise((resolve, reject) => {
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

    const loggerInstance = createLogger({
      format: new JsonFormat(),
      stream: new StringStream()
    })

    const server = Fastify({ loggerInstance })
    server.get('/', async (request, reply) => {
      reply.send('hello world')
    })
    server.listen({ port: 0 }, () => {
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
        resolve()
      })
    })
  })
})

test('should serialze response and request - simple', async (t) => {
  return new Promise((resolve, reject) => {
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

    const loggerInstance = createLogger({
      stream: new StringStream()
    })

    const server = Fastify({ loggerInstance })
    server.get('/', async (request, reply) => {
      reply.send('hello world')
    })
    server.listen({ port: 0 }, () => {
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
        resolve()
      })
    })
  })
})
