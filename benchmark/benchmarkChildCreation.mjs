import bench from "fastbench";
import fs from "fs";
import { createLogger, JsonFormat } from "../lib/Apheleia.mjs";
import pino from "pino";
import winston from "winston";

const pinoLogger = pino(fs.createWriteStream("/dev/null"));

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

export default function childCreation() {
  return new Promise((resolve) => {
    console.log("\nChild Creation:\n");

    const run = bench(
      [
        function benchWinston(cb) {
          for (let i = 0; i < 10; i++) {
            winstonLogger.child({ module: "test" });
          }
          setImmediate(cb);
        },
        function benchPino(cb) {
          for (let i = 0; i < 10; i++) {
            pinoLogger.child({ module: "test" });
          }
          setImmediate(cb);
        },
        function benchApheleia(cb) {
          for (let i = 0; i < 10; i++) {
            apheleiaLoggerJson.child({ module: "test" });
          }
          setImmediate(cb);
        },
      ],
      100000,
    );
    run(resolve);
  });
}
