const express = require('express');
const router = express.Router();
const generator = require('../../../../asyncapi-generator');
const archiver = require('archiver');

module.exports = router;

router.post('/generate', async (req, res) => {
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

router.post('/download', async (req, res, next) => {
  const archive = archiver('zip');
  res.attachment('asyncapi.zip');
  archive.pipe(res);

  archive.append(req.body.data, { name: 'asyncapi.yml' });
  let html;

  try {
    html = await generator.generateTemplateFile({
      template: 'html',
      file: 'index.html',
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

  archive.append(html, { name: 'index.html' });

  try {
    const css = await generator.getTemplateFile({
      template: 'html',
      file: 'css/main.css',
    });
    archive.append(css, { name: 'css/main.css' });

    archive.finalize();
  } catch (e) {
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }
});
