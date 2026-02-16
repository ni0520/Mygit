let express = require('express');
let app = express();
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {haikus: haikus});
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(port);
}

module.exports = app;
