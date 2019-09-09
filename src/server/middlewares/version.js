const AsyncAPIParser = require('asyncapi-parser');

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
    } catch (e) {
      e.code = 'invalid';
      return next(e);
    }

    try {
      if (doc && doc.version().startsWith('1.')) {
        return res.status(422).send({
          code: 'old-version',
          message: `Version ${doc.version()} is not supported. Please convert it to a newer version.`,
        });
      }
      if (doc && doc.version() === '2.0.0-rc1') {
        return res.status(422).send({
          code: 'unsupported-version',
          message: `Version ${doc.version()} is not supported. Only the latest release candidate version is supported until 2.0.0 is released.`,
        });
      }
    } catch (e) {
      return next(e);
    }
  }

  next();
};
