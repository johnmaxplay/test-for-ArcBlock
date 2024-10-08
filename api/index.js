require('dotenv-flow').config();
require('express-async-errors');
const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const fallback = require('@blocklet/sdk/lib/middlewares/fallback');

const db = require('./db');

const { name, version } = require('../package.json');
const logger = require('./libs/logger');

const app = express();

app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '1 mb' }));
app.use(express.urlencoded({ extended: true, limit: '1 mb' }));
app.use(cors());

const router = express.Router();
router.use('/api', require('./routes'));

app.use(router);

const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

if (isProduction) {
  const staticDir = path.resolve(__dirname, '../dist');
  app.use(express.static(staticDir, { maxAge: '30d', index: false }));
  app.use(fallback('index.html', { root: staticDir }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
}

app.get('/api/profile', (req, res) => {
  db.get('SELECT * FROM users WHERE id = 1', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
    // Return an empty profile if none exists yet
    res.json(row || { username: '', email: '', phone: '' });
  });
});

// POST Route - Update user profile
app.post('/api/profile', (req, res) => {
  const { username, email, phone } = req.body;

  // Upsert the profile data into the database (Insert or Update)
  db.run(`
    INSERT OR REPLACE INTO users (id, username, email, phone)
    VALUES (1, ?, ?, ?)
  `, [username, email, phone], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to save user profile.' });
    }
    res.json({ username, email, phone });
  });
});

const port = parseInt(process.env.BLOCKLET_PORT, 10);

const server = app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`> ${name} v${version} ready on ${port}`);
});

module.exports = {
  app,
  server,
};
