const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

const app = express();
const haikus = require("./haikus.json");
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.static("public", { maxAge: "1d" }));
app.set("view engine", "ejs");

// Enable view caching in production for better performance
if (process.env.NODE_ENV === "production") {
  app.set("view cache", true);
}

app.get("/", (req, res) => {
  res.render("index", { haikus });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "The requested resource was not found",
  });
});

app.use((err, req, res, next) => {
  // Log error securely without exposing sensitive details
  if (process.env.NODE_ENV !== "production") {
    console.error("Unhandled error:", err);
  } else {
    console.error("Unhandled error:", err.message);
  }

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
