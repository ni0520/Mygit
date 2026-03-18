const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

// Performance: Add error handling for JSON file loading
let haikus;
try {
  haikus = require("./haikus.json");
  if (!Array.isArray(haikus)) {
    throw new Error("haikus.json must contain an array");
  }
} catch (err) {
  console.error("Failed to load haikus.json:", err.message);
  haikus = []; // Fallback to empty array
}

const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Performance: Enable EJS view caching in production
if (isProduction) {
  app.set("view cache", true);
}

app.use(helmet());

// Performance: Configure compression with optimal settings
app.use(
  compression({
    level: 6, // Balance between compression speed and ratio
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      // Don't compress if client doesn't accept encoding
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// Performance: Use aggressive caching in production, moderate in development
app.use(
  express.static("public", {
    maxAge: isProduction ? "7d" : "1d",
    etag: true,
    lastModified: true,
  }),
);

app.set("view engine", "ejs");

// Performance: Log request timing in development
if (!isProduction) {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

app.get("/", (req, res) => {
  res.render("index", { haikus });
});

app.get("/healthz", (_req, res) => {
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
