/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pino = require('express-pino-logger')();
const auth = require('./auth');

const templateController = require('./TemplateContoller');

const app = express();
app.use(auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const netEvidDB = path.join(__dirname, '..', 'db', 'netevid.db');
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app
  .route('/api/templates')
  .get(async (req, res) => {
    const db = templateController(netEvidDB);
    const result = await db.all();
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  })
  .post(async (req, res) => {
    // inset or update template
    const db = templateController(netEvidDB);
    const result = await db.insertOrUpdate(req.body);
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);
    res.send(result);
  });

app
  .route('/api/templates/:name')
  .get(async (req, res) => {
    const db = templateController(netEvidDB);
    const result = await db.findByName(req.params.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  })
  .post(async (req, res) => {
    res.send(req.params.id);
  })
  .delete(async (req, res) => {
    const db = templateController(netEvidDB);
    const result = await db.deleteByName(req.params.name);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  });

app.route('/api/templates/:name/generate').get(async (req, res) => {
  const db = templateController(netEvidDB);
  const templateName = req.params.name;
  const result = await db.genTemplate(templateName);
  res.setHeader('Content-disposition', `attachment; filename=${templateName}-encode.txt`);
  res.setHeader('Content-type', 'text/plain');
  res.charset = 'UTF-8';
  res.write(result);
  res.end();
});
app.route('/api/templates/:name/details').get(async (req, res) => {
  const db = templateController(netEvidDB);
  const templateName = req.params.name;
  const result = await db.getTemplateDetail(templateName);
  res.send(result);
});

app.route('/api/fields').get(async (req, res) => {
  const db = templateController(netEvidDB);
  const result = await db.getAllFiled();
  res.setHeader('Content-Type', 'application/json');
  res.send(result);
});
// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.listen(8200, () => console.log('Express server is running on localhost:8200'));
