const express = require('express');
const router = express.Router();
const { convert } = require('asyncapi-converter');

module.exports = router;

router.post('/', async (req, res) => {
  try {
    res.send(convert(req.body, '2.0.0-rc2'));
  } catch (e) {
    return res.status(422).send({
      code: 'convert-error',
      message: e.message,
    });
  }
});
