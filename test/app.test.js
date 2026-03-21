const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../index");

test("GET / returns html page", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /text\/html/);
  assert.match(response.text, /給Mona的俳句/);
});

test("GET /healthz returns ok status", async () => {
  const response = await request(app).get("/healthz");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /unknown returns 404 not_found JSON", async () => {
  const response = await request(app).get("/nonexistent-route");

  assert.equal(response.status, 404);
  assert.equal(response.body.error, "not_found");
});

test("GET / includes security headers", async () => {
  const response = await request(app).get("/");

  assert.ok(
    response.headers["x-content-type-options"],
    "x-content-type-options header should be present",
  );
  assert.ok(
    response.headers["x-frame-options"],
    "x-frame-options header should be present",
  );
});

test("GET / includes lazy loading for images", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  // First image should have eager loading
  assert.match(response.text, /loading="eager"/);
  // Other images should have lazy loading
  assert.match(response.text, /loading="lazy"/);
});

test("GET / includes preload hint for first image", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  // Should have preload link for first image
  assert.match(response.text, /<link rel="preload" as="image"/);
});

test("GET /healthz response is cached", async () => {
  const response1 = await request(app).get("/healthz");
  const response2 = await request(app).get("/healthz");

  assert.equal(response1.status, 200);
  assert.equal(response2.status, 200);
  assert.deepEqual(response1.body, response2.body);
});

test("GET / includes Traditional Chinese haiku content", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  // Check for Traditional Chinese haiku text
  assert.match(response.text, /西雅圖的雨/);
  assert.match(response.text, /別忘了帶雨傘/);
  // Check for Traditional Chinese page title
  assert.match(response.text, /給Mona的俳句/);
  // Check for proper language attribute
  assert.match(response.text, /lang="zh-TW"/);
});
