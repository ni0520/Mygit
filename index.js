const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const haikus = require("./haikus.json");
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());

// Request timing middleware for performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`,
    );
  });
  next();
});

app.use(express.static("public", { maxAge: "1d" }));
app.set("view engine", "ejs");

// Enable view caching in production for better performance
if (process.env.NODE_ENV === "production") {
  app.set("view cache", true);
}

// Simple response caching middleware for static data
const cache = new Map();

const cacheMiddleware =
  (key, ttl = 60000) =>
  (req, res, next) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return res.status(cached.status).json(cached.data);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, { data, status: res.statusCode, timestamp: Date.now() });
      return originalJson(data);
    };
    next();
  };

app.get("/", (req, res) => {
  res.render("index", { haikus });
});

app.get("/healthz", cacheMiddleware("healthz", 10000), (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "internal_server_error",
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
