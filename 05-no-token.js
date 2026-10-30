import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com';
const PARAMS = {
  headers: { 'Content-Type': 'application/json' },
  responseCallback: http.expectedStatuses(401)
};

export default function () {
  const body = JSON.stringify({ mustBeVegetarian: true });
  const res = http.post(`${BASE_URL}/api/pizza`, body, PARAMS);
  check(res, { 'request without a token is refused': (r) => r.status === 401 });
  sleep(1);
}
