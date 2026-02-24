const express = require("express");

const app = express();
const haikus = require("./haikus.json");
const port = process.env.PORT || 3000;

app.use(express.static("public", { maxAge: "1d" }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { haikus });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
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
