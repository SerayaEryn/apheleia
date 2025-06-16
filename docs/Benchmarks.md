
# Benchmarks

To run the benchmarks execute `npm run benchmark`.

## Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 4078 ms  |
| Pino                 | 1656 ms  |
| Apheleia             | 1358 ms  |
| Pino - Extreme       | 1145 ms  |      
| Apheleia - SonicBoom | 745 ms   |

## Non-Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 4018 ms  |
| Apheleia             | 1575 ms  |
| Apheleia - SonicBoom | 1032 ms  |

## Child Logging

| Logger               | Duration |
|----------------------|----------|
| Winston              | 4139 ms  |
| Pino                 | 1604 ms  |
| Apheleia             | 1288 ms  |
| Pino - Extreme       | 951 ms   |      
| Apheleia - SonicBoom | 816 ms   |

## Child Creation

| Logger               | Duration |
|----------------------|----------|
| Winston              | 328 ms   |
| Pino                 | 469 ms   |
| Apheleia             | 100 ms   |