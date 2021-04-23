const os = require('os');
const path = require('path');
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
        }
      },
      path: req.header('x-asyncapi-base-url') || req.header('referer') || req.header('origin')
    };

    const generator = new AsyncAPIGenerator('@asyncapi/html-template', os.tmpdir(), {
      entrypoint: 'index.html',
      output: 'string',
      forceWrite: true,
      templateParams: {
        singleFile: true,
      },
    });
    const html = await generator.generateFromString(req.body, parserOptions);

    res.send(html);
  } catch (e) {
    console.error(e);
    return res.status(422).json(e);
  }
});

router.post('/download', async (req, res, next) => {
  let archive;

  try {
    archive = archiver('zip');
    res.attachment('asyncapi.zip');
    archive.pipe(res);

    archive.append(req.body.data, { name: 'asyncapi.yml' });

    const generator = new AsyncAPIGenerator('@asyncapi/html-template', os.tmpdir(), {
      entrypoint: 'index.html',
      output: 'string',
      forceWrite: true,
      templateParams: {
        singleFile: true,
      },
    });
    const html = await generator.generateFromString(req.body.data);

    archive.append(html, { name: 'index.html' });
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
