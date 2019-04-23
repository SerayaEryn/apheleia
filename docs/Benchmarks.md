
# Benchmarks

The benchmarks ran on a 13-inch, Late 2013 MacBook Pro.

To run the benchmarks execute `npm run benchmark`.

## Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 6286 ms  |
| Pino                 | 2381 ms  |
| Apheleia             | 2090 ms  |
| Pino - Extreme       | 1008 ms  |      
| Apheleia - SonicBoom | 696 ms   |

## Non-Json

| Logger               | Duration |
|----------------------|----------|
| Winston              | 5691 ms  |
| Apheleia             | 2876 ms  |
| Apheleia - SonicBoom | 1301 ms  |

## Child Logging

| Logger               | Duration |
|----------------------|----------|
| Winston              | 6734 ms  |
| Pino                 | 2442 ms  |
| Apheleia             | 2145 ms  |
| Pino - Extreme       | 1111 ms  |      
| Apheleia - SonicBoom | 703 ms   |

## Child Creation

| Logger               | Duration |
|----------------------|----------|
| Winston              | 996 ms   |
| Pino                 | 873 ms   |
| Apheleia             | 364 ms   |