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
