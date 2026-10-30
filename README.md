# k6-lab

ITCS386 k6 performance-testing lab. Work is documented in English and uses k6 version 2.3.0 on Windows PowerShell.

## Purpose

Lab covers first HTTP requests, VU and duration execution, iterations, authenticated and unauthenticated API checks, thresholds, a case-sensitive request bug, user journeys, and controlled Part A profiles.

## Repository map

- `01-first-test.js`: first GET request used in Part 0.
- `04-pizza-api.js` through `08-bug-hunt.js`: Part 0 API, threshold, requirement, and bug-hunt scripts.
- `explore.js`: authorized API-value exploration for Step 0.8.
- `journey.js`: home, quotes, and recommendation journey exported as default function.
- `a1-smoke.js` through `a5-soak.js`: Part A profiles that call `journey.js`.
- `RESULTS.md`: measured evidence, Part B answers, threshold outcomes, and analysis notes.
- `reports/*.html`: self-contained k6 dashboard exports.
- `reports/time-series-analysis.json`: small aggregated A4/A5 time-series evidence; raw point JSON is temporary and not committed.

## Safety and scope

Scripts use public practice-site credentials and endpoint data supplied for this lab. Token value is intentionally public practice material, not a private credential.

Run one test at a time. Lab profiles stay at or below 5 VUs and 3 minutes, except authorized A5 soak profile, which runs for 11 scheduled minutes including ramps. Graceful completion of in-flight work can extend wall-clock time beyond configured duration. Do not aim these scripts at systems without authorization.

## PowerShell setup

Open Windows PowerShell in repository directory and confirm k6:

```powershell
k6 version
```

Basic sequential runs:

```powershell
k6 run a1-smoke.js
k6 run a2-average.js
k6 run a3-stress.js
k6 run a4-spike.js
k6 run a5-soak.js
```

Capture process status immediately after each run when evidence is needed:

```powershell
k6 run a2-average.js
$exitCode = $LASTEXITCODE
$exitCode
```

## Dashboard export and raw evidence

k6 2.3.0 dashboard export uses environment variables. `K6_WEB_DASHBOARD_PORT='-1'` disables live dashboard listener; default listener port is 5665. `K6_WEB_DASHBOARD_OPEN='false'` prevents browser launch. This environment form replaces PDF dashboard CLI syntax.

Reusable PowerShell recipe for A2; change `$script`, `$report`, and raw filenames for A3–A5:

```powershell
$script = 'a2-average.js'
$report = 'reports/a2-average.html'
$rawPoints = "$env:TEMP\k6-lab-a2-points.json"
$summary = "$env:TEMP\k6-lab-a2-summary.json"

$env:K6_WEB_DASHBOARD = 'true'
$env:K6_WEB_DASHBOARD_EXPORT = $report
$env:K6_WEB_DASHBOARD_OPEN = 'false'
$env:K6_WEB_DASHBOARD_PORT = '-1'

k6 run --out "json=$rawPoints" --summary-export $summary $script
$exitCode = $LASTEXITCODE
$exitCode

Remove-Item Env:K6_WEB_DASHBOARD
Remove-Item Env:K6_WEB_DASHBOARD_EXPORT
Remove-Item Env:K6_WEB_DASHBOARD_OPEN
Remove-Item Env:K6_WEB_DASHBOARD_PORT
```

Raw JSON and summary files are temporary local evidence. Dashboard HTML and aggregate analysis are committed under `reports/`. Use relative report links from `RESULTS.md`:

- [A2 average report](reports/a2-average.html)
- [A3 stress report](reports/a3-stress.html)
- [A4 spike report](reports/a4-spike.html)
- [A5 soak report](reports/a5-soak.html)
- [Aggregated A4/A5 analysis](reports/time-series-analysis.json)

## Threshold demonstrations

`06-thresholds.js` reads `P95` from environment, defaulting to 1500 ms. `k6 run -e P95=300 06-thresholds.js` intentionally produced exit code 99 because measured p95 exceeded 300 ms. `07-requirement.js` baseline uses p95 below 1000 ms and p99 below 1500 ms; `k6 run -e P95=1 07-requirement.js` intentionally produced exit code 99. Those are threshold demonstrations, not implementation failures.

## Results and submission

Read [RESULTS.md](RESULTS.md) for exact measured numbers, limitations, and Part B reflection. Final student submission is GitHub repository link through MyCourses; no student name or deadline is assumed in this repository.
