# K6 lab results

## Part 0

- Step 0.1: Completed with k6 version 2.3.0. Command: `k6 run --vus 1 --iterations 1 01-first-test.js`. `http_req_duration`: avg 281.04 ms, min 281.04 ms, med 281.04 ms, max 281.04 ms, p(90) 281.04 ms, p(95) 281.04 ms. Requests: 1 at 0.510923 requests/s. Iterations: 1 at 0.510923 iterations/s. Check result: 1 succeeded (100.00%), 0 failed. Failure rate: `http_req_failed` 0.00% (0/1). Exit code: 0.
- Step 0.2: Command: `k6 run --vus 5 --duration 20s 01-first-test.js`. `http_reqs`: 75 total at 3.548131 requests/s. `http_req_duration`: avg 291.09 ms, p(95) 296.73 ms. Iterations: 75 at 3.548131 iterations/s. Checks: 75 succeeded (100.00%), 0 failed. Failure rate: `http_req_failed` 0.00% (0/75). Exit code: 0. Request rate stayed below 5 requests/s because each VU waits for its response, then `sleep(1)`, plus execution overhead. Approximate throughput is `VUs / (response time + sleep time + overhead)`, but exact observed throughput cannot be derived from average duration alone because scheduling and individual response-time variation also affect it.
- Step 0.3: Command: `k6 run --vus 5 --iterations 20 01-first-test.js`. The 20 iterations were shared among 5 VUs, not 20 iterations per VU, and were not required to be evenly split. Completed iterations: 20/20. Interrupted iterations: 0. Requests: 20 at 3.432997 requests/s. `http_req_duration`: avg 284.91 ms, p(95) 288.2 ms. Checks: 20 succeeded (100.00%), 0 failed. Failure rate: `http_req_failed` 0.00% (0/20). Observed elapsed runtime: 5.8 s. Exit code: 0. Unlike duration execution, which determines how long VUs run and allows work count to vary, this iteration execution determined total work at 20 shared iterations.
- Step 0.4: Command: `k6 run 04-pizza-api.js`. Checks: `status is 200` passed (1/1), `pizza has a name` passed (1/1), and `every ingredient is vegetarian` passed (1/1); 3/3 checks succeeded and 0 failed. Requests: 1 at 0.492907 requests/s. `http_req_duration`: avg 385.81 ms, p(95) 385.81 ms. Iterations: 1 completed, 0 interrupted, at 0.492907 iterations/s. Failure rate: `http_req_failed` 0.00% (0/1). Observed elapsed runtime: 2.0 s. Exit code captured immediately after the run: 0. These checks validate response contents beyond HTTP status. No thresholds are configured, so a check failure alone does not ensure a nonzero process exit code.
- Step 0.6: Not run yet. Record normal and P95=300 exit codes.
- Step 0.7: Not run yet. Record rules, p95, p99, changed exit code.
- Step 0.8: Not run yet. Record bug and checks.

## Part A

| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
|---|---|---:|---:|---:|---:|---:|---|
| A1 | Smoke | 1 | Not run yet | Not run yet | Not run yet | Not run yet | Not run yet |
| A2 | Average load | 3 | Not run yet | Not run yet | Not run yet | Not run yet | Not run yet |
| A3 | Stress | 5 | Not run yet | Not run yet | Not run yet | Not run yet | Not run yet |
| A4 | Spike | 5 | Not run yet | Not run yet | Not run yet | Not run yet | Not run yet |
| A5 | Soak | 2 | Not run yet | Not run yet | Not run yet | Not run yet | Not run yet |

## Part B

1. Pending
2. Pending
3. Pending
4. Pending
5. Pending
6. Pending
7. Pending
8. Pending
9. Pending
