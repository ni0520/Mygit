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
