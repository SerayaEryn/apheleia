import test from "ava";
import Fastify from "fastify";
import { createLogger, JsonFormat } from "../lib/Apheleia.mjs";
import { Writable } from "stream";

test("should serialze response and request - json", async (t) => {
  t.plan(2);

  let log = "";
  class StringStream extends Writable {
    constructor() {
      super({
        write(chunk, encoding, callback) {
          log += chunk;
          callback(null);
        },
      });
    }
  }

  const loggerInstance = createLogger({
    format: new JsonFormat(),
    stream: new StringStream(),
  });

  const server = Fastify({ loggerInstance });
  server.get("/", async (request, reply) => {
    reply.send("hello world");
  });
  await server.listen({ port: 0 });
  server.server.unref();
  const port = server.server.address().port;
  const response = await fetch("http://localhost:" + port + "/", {
    headers: { "x-test": "hello world" },
  });
  await response.text();
  t.true(
    /.*,"req":{"method":"GET","url":"\/","hostname":.*,"remoteAddress":.*,"remotePort":.*/.test(
      log,
    ),
  );
  t.true(/.*,"res":{"statusCode":200}.*/.test(log));
  await server.close();
});

test("should serialze response and request - simple", async (t) => {
  t.plan(2);

  let log = "";
  class StringStream extends Writable {
    constructor() {
      super({
        write(chunk, encoding, callback) {
          log += chunk;
          callback(null);
        },
      });
    }
  }

  const loggerInstance = createLogger({ stream: new StringStream() });

  const server = Fastify({ loggerInstance });
  server.get("/", async (request, reply) => {
    reply.send("hello world");
  });
  await server.listen({ port: 0 });
  server.server.unref();
  const port = server.server.address().port;
  const response = await fetch("http://localhost:" + port + "/", {
    headers: { "x-test": "hello world" },
  });
  await response.text();
  t.true(
    /.* method=GET url=\/ hostname=.* remoteAddress=.* remotePort=.*/.test(log),
  );
  t.true(/.* statusCode=200.*/.test(log));
  await server.close();
});
