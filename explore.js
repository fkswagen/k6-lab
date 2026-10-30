import http from 'k6/http';

const BASE_URL = 'https://quickpizza.grafana.com';
const PARAMS = {
  headers: {
    Authorization: 'token abcdef0123456789'
  }
};

export default function () {
  const ingredients = http.get(`${BASE_URL}/api/ingredients/topping`, PARAMS);
  const tools = http.get(`${BASE_URL}/api/tools`, PARAMS);
  console.log(`GET /api/ingredients/topping: ${ingredients.body}`);
  console.log(`GET /api/tools: ${tools.body}`);
}
