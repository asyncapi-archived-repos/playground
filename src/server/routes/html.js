const express = require('express');
const router = express.Router();
const generator = require('asyncapi-generator');
const archiver = require('archiver');
const version = require('../middlewares/version');
const circularMiddleware = require('../middlewares/circular');

module.exports = router;

router.post('/generate', circularMiddleware, version, async (req, res) => {
  try {
    const html = await generator.generateTemplateFile({
      template: 'html',
      file: 'content.html',
      config: {
        asyncapi: req.body,
      }
    });

    res.send(html);
  } catch (e) {
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }
});

router.get('/template/css/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await generator.getTemplateFile({
      template: 'html',
      file: `css/${filename}`,
    });

    res.header('Content-Type', 'text/css').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.get('/template/js/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await generator.getTemplateFile({
      template: 'html',
      file: `js/${filename}`,
    });

    res.header('Content-Type', 'application/javascript').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.post('/download', circularMiddleware, version, async (req, res, next) => {
  const archive = archiver('zip');
  res.attachment('asyncapi.zip');
  archive.pipe(res);

  archive.append(req.body.data, { name: 'asyncapi.yml' });
  try {
    const html = await generator.generateTemplateFile({
      template: 'html',
      file: 'index.html',
      config: {
        asyncapi: req.body.data,
      }
    });
    archive.append(html, { name: 'index.html' });
  } catch (e) {
    console.error(e);
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }

  try {
    const css = await generator.getTemplateFile({
      template: 'html',
      file: 'css/tailwind.min.css',
    });
    archive.append(css, { name: 'css/tailwind.min.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const css = await generator.getTemplateFile({
      template: 'html',
      file: 'css/atom-one-dark.min.css',
    });
    archive.append(css, { name: 'css/atom-one-dark.min.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const css = await generator.getTemplateFile({
      template: 'html',
      file: 'css/main.css',
    });
    archive.append(css, { name: 'css/main.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const js = await generator.getTemplateFile({
      template: 'html',
      file: 'js/highlight.min.js',
    });
    archive.append(js, { name: 'js/highlight.min.js' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const js = await generator.getTemplateFile({
      template: 'html',
      file: 'js/main.js',
    });
    archive.append(js, { name: 'js/main.js' });

    archive.finalize();
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }
});
