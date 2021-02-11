const os = require('os');
const express = require('express');
const router = express.Router();
const AsyncAPIGenerator = require('@asyncapi/generator');
const archiver = require('archiver');
const version = require('../middlewares/version');

module.exports = router;

router.post('/generate', version, async (req, res) => {
  try {
    const parserOptions = {
      resolve: {
        file: false,
        http: {
          headers: {
            Cookie: req.header('Cookie'),
          },
          withCredentials: true,
        },
      },
      path: req.header('x-asyncapi-base-url') || req.header('referer') || req.header('origin')
    };

    const generator = new AsyncAPIGenerator('@asyncapi/markdown-template', os.tmpdir(), {
      entrypoint: 'asyncapi.js',
      output: 'string',
      forceWrite: true,
    });
    const markdown = await generator.generateFromString(req.body, parserOptions);

    res.send(markdown.content);
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
    const generator = new AsyncAPIGenerator('@asyncapi/markdown-template', os.tmpdir(), {
      entrypoint: 'asyncapi.js',
      output: 'string',
      forceWrite: true,
    });
    const markdown = await generator.generateFromString(req.body.data);
    archive.append(markdown.content, { name: 'asyncapi.md' });
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
