const AsyncAPIParser = require('asyncapi-parser');

function checkVersion (doc, res) {
  if (doc && doc.asyncapi.startsWith('1.')) {
    return res.status(422).send({
      code: 'old-version',
      message: `Version ${doc.asyncapi} is not supported. Please convert it to a newer version.`,
    });
  }
  if (doc && doc.asyncapi.startsWith('2.0.0-rc')) {
    return res.status(422).send({
      code: 'unsupported-version',
      message: `Version ${doc.asyncapi} is not supported. Use version 2.0.0 instead.`,
    });
  }

  return false;
}

module.exports = async (req, res, next) => {
  if (req.body) {
    let doc;

    try {
      doc = await AsyncAPIParser.parse(req.body, {
        resolve: {
          file: false,
        },
        dereference: {
          circular: 'ignore',
        }
      });

      checkVersion(doc.json(), res);
      next();
    } catch (e) {
      e.code = 'invalid';
      if (checkVersion(e.parsedJSON, res) === false) {
        return next(e);
      }
    }
  }
};
