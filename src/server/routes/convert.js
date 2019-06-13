const express = require('express');
const router = express.Router();
const { convert } = require('asyncapi-converter');
const circular = require('../middlewares/circular');

module.exports = router;

router.post('/', circular, async (req, res) => {
  try {
    res.send(convert(req.body, '2.0.0-rc1'));
  } catch (e) {
    return res.status(422).send({
      code: 'convert-error',
      message: e.message,
    });
  }
});
