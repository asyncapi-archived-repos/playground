const express = require('express');
const router = express.Router();
const generator = require('asyncapi-generator');
const archiver = require('archiver');

module.exports = router;

router.post('/generate', async (req, res) => {
  try {
    const markdown = await generator.generateTemplateFile({
      template: 'markdown',
      file: 'asyncapi.md',
      config: {
        asyncapi: req.body,
      }
    });

    res.send(markdown);
  } catch (e) {
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }
});

router.post('/download', async (req, res, next) => {
  const archive = archiver('zip');
  res.attachment('asyncapi.zip');
  archive.pipe(res);

  archive.append(req.body.data, { name: 'asyncapi.yml' });
  try {
    const markdown = await generator.generateTemplateFile({
      template: 'markdown',
      file: 'asyncapi.md',
      config: {
        asyncapi: req.body.data,
      }
    });
    archive.append(markdown, { name: 'asyncapi.md' });
    archive.finalize();
  } catch (e) {
    console.error(e);
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }
});
