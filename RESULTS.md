# K6 lab results

## Part 0

### Step 0.1: First request

- Command: `k6 run --vus 1 --iterations 1 01-first-test.js`
- k6 version: 2.3.0
- `http_req_duration`: avg 281.04 ms, min 281.04 ms, med 281.04 ms, max 281.04 ms, p(90) 281.04 ms, p(95) 281.04 ms.
- Requests: 1 at 0.510923 requests/s.
- Iterations: 1 at 0.510923 iterations/s.
- Checks: 1 succeeded (100.00%), 0 failed.
- Failure rate: `http_req_failed` 0.00% (0/1).
- Exit code: 0.

### Step 0.2: Five VUs for twenty seconds

- Command: `k6 run --vus 5 --duration 20s 01-first-test.js`
- `http_reqs`: 75 total at 3.548131 requests/s.
- `http_req_duration`: avg 291.09 ms, p(95) 296.73 ms.
- Iterations: 75 at 3.548131 iterations/s.
- Checks: 75 succeeded (100.00%), 0 failed.
- Failure rate: `http_req_failed` 0.00% (0/75).
- Exit code: 0.
- Rate stayed below 5 requests/s because each VU waits for response, then `sleep(1)`, plus overhead. Approximate throughput is `VUs / (response time + sleep time + overhead)`. Exact observed throughput cannot be derived from average duration alone because scheduling and individual response-time variation also affect it.

### Step 0.3: Shared iterations

- Command: `k6 run --vus 5 --iterations 20 01-first-test.js`
- The 20 iterations were shared among 5 VUs, not 20 iterations per VU, and were not required to be evenly split.
- Completed iterations: 20/20. Interrupted iterations: 0.
- Requests: 20 at 3.432997 requests/s.
- `http_req_duration`: avg 284.91 ms, p(95) 288.2 ms.
- Checks: 20 succeeded (100.00%), 0 failed.
- Failure rate: `http_req_failed` 0.00% (0/20).
- Observed elapsed runtime: 5.8 s.
- Exit code: 0.
- Duration execution determines time and lets work count vary; iteration execution determines total shared work.

### Step 0.4: Authenticated pizza API

- Command: `k6 run 04-pizza-api.js`
- Checks: `status is 200` passed (1/1); `pizza has a name` passed (1/1); `every ingredient is vegetarian` passed (1/1).
- Checks total: 3/3 passed, 0 failed.
- Requests: 1 at 0.492907 requests/s.
- `http_req_duration`: avg 385.81 ms, p(95) 385.81 ms.
- Iterations: 1 completed, 0 interrupted.
- Failure rate: `http_req_failed` 0.00% (0/1).
- Observed elapsed runtime: 2.0 s.
- Exit code: 0.
- Content checks validate more than HTTP status. No thresholds are configured, so check failure alone does not ensure nonzero process exit.

### Step 0.5: Missing token

- Command: `k6 run 05-no-token.js`
- Check `request without a token is refused`: passed (1/1).
- Requests: 1 at 0.511913 requests/s.
- `http_req_duration`: avg 291.89 ms, p(95) 291.89 ms.
- Iterations: 1 completed, 0 interrupted.
- Failure rate: `http_req_failed` 0.00% (0/1).
- Exit code: 0.

### Step 0.6: Thresholds

- Thresholds: `http_req_failed: rate<0.01`, `http_req_duration: p(95)<P95`, `checks: rate>0.99`.
- Default `P95`: 1500 ms.

#### Normal run

- Command: `k6 run 06-thresholds.js`
- 3 VUs for 30s; 66 iterations; 66 requests at 2.136507 requests/s.
- `http_req_duration`: avg 361.44 ms, p(95) 410.25 ms.
- Checks: 132/132 passed. `http_req_failed`: 0.00% (0/66).
- All thresholds passed. Exit code: 0.

#### P95 override

- Command: `k6 run -e P95=300 06-thresholds.js`
- 3 VUs for 30s; 66 iterations; 66 requests at 2.156712 requests/s.
- `http_req_duration`: avg 357.9 ms, p(95) 391.61 ms.
- Checks: 132/132 passed. `http_req_failed`: 0.00% (0/66).
- `checks` and `http_req_failed` thresholds passed; `http_req_duration p(95)<300` failed.
- Exit code: 99. This was intentional threshold demonstration.

### Step 0.7: P95/P99 requirement

- Requirements: 3 VUs for 30s; `http_req_failed rate<0.01`; `http_req_duration p(95)<1000 ms`; `p(99)<1500 ms`. No checks threshold.

#### Baseline

- Command: `k6 run 07-requirement.js`
- 66 requests at 2.144754 requests/s.
- `http_req_duration`: avg 360.67 ms, p(95) 403.12 ms, p(99) 476.48 ms.
- Checks: 132/132 passed. `http_req_failed`: 0.00% (0/66).
- All requirements passed. Exit code: 0.

#### Changed P95 requirement

- Command: `k6 run -e P95=1 07-requirement.js`
- 66 requests at 2.150102 requests/s.
- `http_req_duration`: avg 355.11 ms, p(95) 401.2 ms, p(99) 506.57 ms.
- Checks: 132/132 passed. `http_req_failed`: 0.00% (0/66).
- `p(95)<1 ms` failed; `p(99)<1500 ms` and `http_req_failed` passed.
- Exit code: 99. Default script requirement remains P95=1000 ms; only environment override changed.

### Step 0.8: Bug hunt

#### Preliminary evidence with incorrect extra restriction

- Prior original and fixed runs both included extra `mustBeVegetarian: true`; they are not exact lab baseline evidence.
- Preliminary original command: `k6 run --vus 5 --duration 20s 08-bug-hunt.js`.
  - 75 requests and 75 iterations at 3.560788 requests/iterations per second.
  - `http_req_duration`: avg 355.21 ms, p(95) 395.56 ms.
  - `status is 200`: 75/75 passed.
  - `pizza excludes Pepperoni`: 75/75 passed.
  - `pizza does not use Knife`: 49/75 passed, 26/75 failed.
  - Overall checks: 199/225 passed (88.44%), 26/225 failed (11.55%).
  - `http_req_failed`: 0.00% (0/75). Exit code: 0.
- Preliminary fixed command with canonical values: `k6 run --vus 5 --duration 20s 08-bug-hunt.js`.
  - 74 requests and 74 iterations at 3.467142 requests/iterations per second.
  - `http_req_duration`: avg 364.08 ms, p(95) 411.5 ms.
  - All three checks passed 74/74; overall checks 222/222 passed.
  - `http_req_failed`: 0.00% (0/74). Exit code: 0.

#### Exploration

- Command: `k6 run explore.js`.
- Ingredients schema: `{ingredients:[{ID,name,caloriesPerSlice,vegetarian}]}` with canonical `Pepperoni`.
- Tools: `{tools:["Knife","Pizza cutter","Scissors"]}`.

#### Corrected exact baseline without vegetarian restriction

- Command: `k6 run --vus 5 --duration 20s 08-bug-hunt.js` using lowercase values.
- 75 requests and 75 iterations at 3.540924 requests/iterations per second.
- `http_req_duration`: avg 351.98 ms, p(95) 392.71 ms, max 733.56 ms.
- `status is 200`: 75/75 passed.
- `pizza excludes Pepperoni`: 69/75 passed, 6/75 failed.
- `pizza does not use Knife`: 52/75 passed, 23/75 failed.
- Overall checks: 196/225 passed (87.11%), 29/225 failed (12.88%).
- `http_req_failed`: 0.00% (0/75). Exit code: 0.

#### Corrected fixed run

- Command: `k6 run --vus 5 --duration 20s 08-bug-hunt.js` using canonical values.
- 73 requests and 73 iterations at 3.4439 requests/iterations per second.
- `http_req_duration`: avg 372.65 ms, p(95) 524.01 ms, max 752.06 ms.
- All three checks passed 73/73; overall checks 219/219 passed.
- `http_req_failed`: 0.00% (0/73). Exit code: 0.
- Root cause: exclusion values are case-sensitive. Lowercase values allowed canonical `Pepperoni` and `Knife`; canonical values prevented both.
- Repeated sampling makes random invalid outputs easier to detect. Load is not required to cause the bug.

## Part A

| Step | Test type | Users | Req/s | p(95) | Max | Failed | Checks |
|---|---|---:|---:|---:|---:|---:|---|
| A1 | Smoke | 1 | 0.503822 | 392.77 ms | 399.15 ms | 0.00% (0/18) | 100.00% (24/24) |
| A2 | Average load | 3 | 1.241752 | 392.73 ms | 10.14 s | 0.00% (0/225) | 100.00% (300/300) |
| A3 | Stress | 5 | 2.103393 | 397.08 ms | 703.95 ms | 0.00% (0/387) | 100.00% (516/516) |
| A4 | Spike | 5 | 1.024881 | 374.57 ms | 636.1 ms | 0.00% (0/144) | 100.00% (192/192) |
| A5 | Soak | 2 | 0.976463 | 393.13 ms | 2.61 s | 0.00% (0/645) | 100.00% (860/860) |

### A1 details

- Command: `k6 run a1-smoke.js`.
- 1 VU for 30s; 6 completed iterations, 0 interrupted; 18 requests at 0.503822 requests/s.
- `http_req_duration`: avg 308.75 ms, p(95) 392.77 ms, max 399.15 ms.
- Checks: 24/24 passed. `http_req_failed`: 0.00% (0/18).
- Thresholds `checks rate>.99` and `http_req_failed rate<.01` passed. Exit code: 0. Observed elapsed runtime: 35.7 s.

### A2 details

- PowerShell dashboard environment: `$env:K6_WEB_DASHBOARD='true'`, `$env:K6_WEB_DASHBOARD_EXPORT='reports/a2-average.html'`, `$env:K6_WEB_DASHBOARD_OPEN='false'`, `$env:K6_WEB_DASHBOARD_PORT='-1'`.
- Invocation: `k6 run a2-average.js`; raw JSON and summary were also exported to local temporary files, not committed.
- Stages: 30s to 3 VUs, 2m at 3 VUs, then 30s to 0. 75 iterations and 225 requests at 1.241752 requests/s.
- `http_req_duration`: avg 429.83 ms, p(95) 392.73 ms, max 10.14 s.
- Checks: 300/300 passed. `http_req_failed`: 0.00% (0/225).
- Group p(95): home 297.99 ms; recommendation 406.89 ms. All thresholds passed. Exit code: 0. Observed elapsed runtime: 3m1.2s.
- Report: [`reports/a2-average.html`](reports/a2-average.html), self-contained, 176,412 bytes.

### A3 details

- PowerShell dashboard environment: `$env:K6_WEB_DASHBOARD='true'`, `$env:K6_WEB_DASHBOARD_EXPORT='reports/a3-stress.html'`, `$env:K6_WEB_DASHBOARD_OPEN='false'`, `$env:K6_WEB_DASHBOARD_PORT='-1'`.
- Invocation: `k6 run a3-stress.js`; raw JSON and summary were also exported to local temporary files, not committed.
- Stages: 30s to 5 VUs, 2m at 5 VUs, then 30s to 0. 129 iterations and 387 requests at 2.103393 requests/s.
- `http_req_duration`: avg 314.39 ms, p(95) 397.08 ms, max 703.95 ms.
- Checks: 516/516 passed. `http_req_failed`: 0.00% (0/387).
- Group p(95): home 556.94 ms; recommendation 399.87 ms. All thresholds passed. Exit code: 0. Observed elapsed runtime: 3m4.0s.
- Report: [`reports/a3-stress.html`](reports/a3-stress.html), self-contained, 177,252 bytes.

### A4 details

- PowerShell dashboard environment: `$env:K6_WEB_DASHBOARD='true'`, `$env:K6_WEB_DASHBOARD_EXPORT='reports/a4-spike.html'`, `$env:K6_WEB_DASHBOARD_OPEN='false'`, `$env:K6_WEB_DASHBOARD_PORT='-1'`.
- Invocation: `k6 run a4-spike.js`; raw JSON and summary were also exported to local temporary files, not committed.
- Stages: 30s at 1 VU, 5s to 5 VUs, 30s at 5 VUs, 5s to 1 VU, 1m at 1 VU, then 10s to 0. 48 iterations and 144 requests at 1.024881 requests/s.
- `http_req_duration`: avg 306.35 ms, p(95) 374.57 ms, max 636.1 ms.
- Checks: 192/192 passed. `http_req_failed`: 0.00% (0/144).
- Group p(95): home 292.47 ms; recommendation 391.2 ms. All thresholds passed. Exit code: 0. Observed elapsed runtime: 2m20.5s.
- Report: [`reports/a4-spike.html`](reports/a4-spike.html), self-contained, 173,240 bytes.
- Analysis: [`reports/time-series-analysis.json`](reports/time-series-analysis.json). Origin `2026-10-30T16:00:19.7348660Z`; pre-spike [0,30) had 15 requests at p95 343.36 ms; high [35,65) had 73 requests at p95 374.55 ms; first post-drop [70,80) had p95 352.89 ms, within 10% of baseline, with no failures. No material sustained degradation or measurable recovery event was observed. Sparse buckets and mixed endpoints limit precision.

### A5 details

- PowerShell dashboard environment: `$env:K6_WEB_DASHBOARD='true'`, `$env:K6_WEB_DASHBOARD_EXPORT='reports/a5-soak.html'`, `$env:K6_WEB_DASHBOARD_OPEN='false'`, `$env:K6_WEB_DASHBOARD_PORT='-1'`.
- Invocation: `k6 run a5-soak.js`; raw JSON and summary were also exported to local temporary files, not committed.
- Stages: 30s to 2 VUs, 10m at 2 VUs, then 30s to 0. 215 iterations and 645 requests at 0.976463 requests/s.
- `http_req_duration`: avg 314.64 ms, p(95) 393.13 ms, max 2.61 s.
- Checks: 860/860 passed. `http_req_failed`: 0.00% (0/645).
- Group p(95): home 289.95 ms; recommendation 399.81 ms. All thresholds passed. Exit code: 0. Observed elapsed runtime: 11m0.5s.
- Report: [`reports/a5-soak.html`](reports/a5-soak.html), self-contained, 198,180 bytes.
- Analysis origin: `2026-10-30T16:04:03.7103849Z`. Early steady [30,150) had 121 requests, mean 308.18 ms, p95 385.18 ms, 0.0% errors. Late steady [510,630) had 119 requests, mean 309.66 ms, p95 391.2 ms, 0.0% errors. Difference: +1.48 ms mean and +6.02 ms p95; per-60-second trend showed no sustained increase. Mixed endpoints prevent server-side memory-leak claims.

## Part B

### 1. Results reference

Completed A1–A5 results are in Part A table above. Detailed commands, thresholds, checks, reports, and analysis follow table.

### 2. Why did Step 0.2 stay below 5 requests/s?

Observed rate was 3.548131 requests/s with 5 VUs. Each VU performs one request, waits for response, then sleeps for 1 second before next iteration. Network response time, JavaScript execution, scheduling, and other overhead add time. Approximate throughput is:

`throughput ≈ VUs / (response time + sleep time + execution overhead)`

Average response duration alone cannot reproduce exact observed rate because VUs are independently scheduled and response durations vary.

### 3. A2 versus A3

A2 p(95) was 392.73 ms; A3 p(95) was 397.08 ms. Difference was 4.35 ms, approximately 1.11% relative to A2. Throughput increased from 1.241752 to 2.103393 requests/s. Both runs had zero request failures and all checks passed. A2 also had a notable 10.14 s maximum despite p95 passing; its avg 429.83 ms exceeded p95 392.73 ms because a small tail of slow observations lifted the average. These small public-scale tests are far inside the observed envelope and do not prove a capacity boundary or stress limit.

### 4. What happened during the spike?

Using timestamp-aligned phases, pre-spike [0,30) had p95 343.36 ms. High phase [35,65) had p95 374.55 ms. First fully post-drop 10-second bucket [70,80) had p95 352.89 ms, within 10% of baseline, with zero failures. Operationally, recovery means first post-drop bucket within 10% of baseline without increased failures. Evidence supports recovery within that first analyzed 10-second bucket, not an exact recovery second. Sparse samples and mixed home, quotes, and recommendation endpoints limit precision.

### 5. Did the soak test show degradation?

Early steady window [30,150): p95 385.18 ms, mean 308.18 ms, zero failures. Late steady window [510,630): p95 391.20 ms, mean 309.66 ms, zero failures. Mean changed +1.48 ms and p95 changed +6.02 ms. Per-60-second trend showed no sustained increase. A several-hour soak could reveal memory leaks or resource exhaustion that this 11-minute run cannot prove absent.

### 6. Why can p95 hide a problem?

p95 describes the slowest edge of 95% of observations. It can hide the slowest 5%; A2 demonstrates this because p95 was 392.73 ms while maximum was 10.14 s. Average can hide the same minority even more strongly. Serious tail problems require p95, p99, maximum, counts, and failure rate together.

### 7. Internet and shared-site variability

These runs used an internet-hosted public practice site. Compared with a controlled lab network and server, latency can vary due to local connectivity, routing, TLS setup, remote server background load, rate limiting, and other users. Results are observed measurements for this environment and time, not universal service limits.

### 8. Safe load limits

Concurrent load can disrupt other users, consume shared resources, trigger provider protections, or violate service policy. This lab used a maximum of 5 VUs and durations up to 3 minutes, except the authorized 11-minute A5 soak. Those limits provide safe practice boundaries; they do not imply permission for higher load against a third-party service. Load tests should target controlled, authorized environments.

### 9. Hypothetical production requirement

Ordinary example: an authorized messaging app wants predictable send-message latency for three concurrent users. This is hypothetical, was not tested here, and has no measurements.

Specific requirement: in a controlled authorized test environment, run 3 concurrent VUs for 30 seconds against the app's authorized send-message endpoint; require p95 latency below 1000 ms, p99 latency below 1500 ms, and request failure rate below 1%.

Illustrative k6 options only; no request and no real target are included:

```javascript
export const options = {
  vus: 3,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<1000', 'p(99)<1500'],
    http_req_failed: ['rate<0.01']
  }
};

export default function () {
  // An authorized messaging request would be defined here.
}
```

## Submission notes

- This repository contains measured scripts, reports, and results for ITCS386 practice.
- Student submits GitHub repository link through MyCourses manually.
- No student name or deadline is inferred here.
