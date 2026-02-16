const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../index');

test('GET / should return 200', async () => {
  const response = await request(app).get('/');
  assert.equal(response.status, 200);
});

test('GET /healthz should return 200 and expected payload', async () => {
  const response = await request(app).get('/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});
