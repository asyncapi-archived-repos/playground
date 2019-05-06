const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { GracefulShutdownManager } = require('@moebius/http-graceful-shutdown');
const exphbs = require('express-handlebars');
const config = require('./lib/config');
const handlebarsHelpers = require('./lib/handlebars');
const app = express();
const htmlRoute = require('./routes/html');
const markdownRoute = require('./routes/markdown');

app.use(bodyParser.text({ type: 'text/plain' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../../public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: handlebarsHelpers,
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('app', config.views);
});
app.use('/html', htmlRoute);
app.use('/markdown', markdownRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Unexpected Error');
});

const server = app.listen(process.env.PORT || config.api.port);
const shutdownManager = new GracefulShutdownManager(server);

process.on('SIGTERM', () => {
  shutdownManager.terminate(() => {
    console.log('Server has been gracefully terminated');
  });
});
