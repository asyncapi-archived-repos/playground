const yaml = require('js-yaml');

module.exports = (req, res, next) => {
  if (req.body) {
    let doc;

    try {
      doc = yaml.safeLoad(req.body);
    } catch (e) {
      try {
        doc = JSON.parse(req.body);
      } catch (err) {
        return next();
      }
    }

    if (doc && doc.asyncapi && doc.asyncapi.startsWith('1.')) {
      return res.status(422).send({
        code: 'old-version',
        message: `Version ${doc.asyncapi} is not supported. Please convert it to a newer version.`,
      });
    }
  }

  next();
};
