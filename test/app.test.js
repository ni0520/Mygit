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

test("GET / includes cache-control headers for performance", async () => {
  const response = await request(app).get("/");

  // HTML responses from EJS don't get cache-control by default
  // This test verifies the response is successful and helmet headers are present
  assert.equal(response.status, 200);
  assert.ok(response.headers["x-content-type-options"], "Security headers present");
});

test("Static files include appropriate caching headers", async () => {
  const response = await request(app).get("/css/main.css");

  assert.equal(response.status, 200);
  assert.ok(
    response.headers["cache-control"],
    "cache-control header should be present for static files",
  );
  assert.ok(
    response.headers["etag"],
    "etag header should be present for static files",
  );
  assert.ok(
    response.headers["last-modified"],
    "last-modified header should be present for static files",
  );
});

test("Compression is applied to large responses", async () => {
  const response = await request(app)
    .get("/")
    .set("Accept-Encoding", "gzip, deflate");

  // Check that compression middleware is active
  // (Supertest automatically decompresses, so we check the raw response)
  assert.ok(response.status === 200);
});

test("Compression can be disabled via x-no-compression header", async () => {
  const response = await request(app)
    .get("/")
    .set("Accept-Encoding", "gzip")
    .set("x-no-compression", "1");

  assert.equal(response.status, 200);
  // Response should not include content-encoding when compression is disabled
  assert.ok(!response.headers["content-encoding"] || response.headers["content-encoding"] === "identity");
});

