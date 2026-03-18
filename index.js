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

app.get("/", (req, res) => {
  res.render("index", { haikus });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error("未處理的錯誤:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "內部伺服器錯誤",
  });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`伺服器正在連接埠 ${port} 上運行`);
  });
}

module.exports = app;
