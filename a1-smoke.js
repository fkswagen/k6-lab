export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    checks: ['rate>.99'],
    http_req_failed: ['rate<.01']
  }
};

export { default } from './journey.js';
