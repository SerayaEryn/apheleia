import bench from "fastbench";
import fs from "fs";
import { createLogger, JsonFormat } from "../lib/Apheleia.mjs";
import pino from "pino";
import SonicBoom from "sonic-boom";
import winston from "winston";

const pinoLogger = pino(fs.createWriteStream("/dev/null"));
const pinoExtreme = pino(pino.destination({ sync: false, dest: "/dev/null" }));

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream("/dev/null"),
      format: winston.format.json(),
    }),
  ],
});

const apheleiaLoggerJson = createLogger({
  stream: fs.createWriteStream("/dev/null"),
  format: new JsonFormat(),
});

const apheleiaLoggerJsonSonicBoom = createLogger({
  stream: new SonicBoom({ dest: "/dev/null", minLength: 0, sync: false }),
  format: new JsonFormat(),
});

const testObject = {
  ip: "127.0.0.1",
  id: "CFPouPXNLMFLtrfVxfzW",
  method: "GET",
  protocol: "http:",
  url: "http://127.0.0.1:3000/test",
  query: "?test=true",
};

export default function objectJsonFormat() {
  return new Promise((resolve) => {
    const run = bench(
      [
        function benchWinston(cb) {
          for (let i = 0; i < 10; i++) {
            winstonLogger.info("hello world", testObject);
          }
          setImmediate(cb);
        },
        function benchPino(cb) {
          for (let i = 0; i < 10; i++) {
            pinoLogger.info("hello world", testObject);
          }
          setImmediate(cb);
        },
        function benchApheleiaJson(cb) {
          for (let i = 0; i < 10; i++) {
            apheleiaLoggerJson.info("hello world", testObject);
          }
          setImmediate(cb);
        },
        function benchPinoExtreme(cb) {
          for (let i = 0; i < 10; i++) {
            pinoExtreme.info("hello world", testObject);
          }
          setImmediate(cb);
        },
        function benchApheleiaJsonSonicBoom(cb) {
          for (let i = 0; i < 10; i++) {
            apheleiaLoggerJsonSonicBoom.info("hello world", testObject);
          }
          setImmediate(cb);
        },
      ],
      100000,
    );
    console.log("\nObject JsonFormat:\n");
    run(resolve);
  });
}
