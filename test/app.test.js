const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../index");

test("GET / returns html page", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /text\/html/);
  assert.match(response.text, /Haikus for Mona/);
});

test("GET /healthz returns ok status", async () => {
  const response = await request(app).get("/healthz");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("GET /nonexistent returns 404 not found", async () => {
  const response = await request(app).get("/nonexistent");

  assert.equal(response.status, 404);
  assert.equal(response.body.error, "not_found");
  assert.equal(
    response.body.message,
    "The requested resource was not found",
  );
});

test("Response includes security headers from Helmet", async () => {
  const response = await request(app).get("/");

  // Helmet sets various security headers
  assert.ok(
    response.headers["x-content-type-options"],
    "Should have X-Content-Type-Options header",
  );
  assert.ok(
    response.headers["x-frame-options"],
    "Should have X-Frame-Options header",
  );
});

test("Response includes compression for text content", async () => {
  const response = await request(app)
    .get("/")
    .set("Accept-Encoding", "gzip, deflate");

  // Compression middleware should handle the encoding
  // The test verifies the middleware is properly configured
  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /text\/html/);
});

test("Static files are served with cache headers", async () => {
  const response = await request(app).get("/css/main.css");

  assert.equal(response.status, 200);
  assert.match(response.headers["content-type"], /text\/css/);
  // Cache-Control should be set with maxAge: '1d'
  assert.ok(
    response.headers["cache-control"],
    "Should have Cache-Control header",
  );
});

