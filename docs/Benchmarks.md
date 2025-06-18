
# Benchmarks

To run the benchmarks execute `npm run benchmark`.

## Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 3941 ms  |
| Pino                 | 1804 ms  |
| Apheleia             | 1259 ms  |
| Pino - Extreme       | 1217 ms  |      
| Apheleia - SonicBoom | 718 ms   |

## Non-Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 3864 ms  |
| Apheleia             | 1518 ms  |
| Apheleia - SonicBoom | 1089 ms  |

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