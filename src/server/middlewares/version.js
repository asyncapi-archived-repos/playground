const yaml = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

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

    const parser = new RefParser();
    parser.dereference(doc)
      .then(() => {
        if (parser.$refs.circular) {
          console.log('>>>>>>>>>>>>>>>>> The schema contains circular references');
        }
      })
      .catch((err) => {
        console.error(err);
      });

    if (doc && doc.asyncapi && doc.asyncapi.startsWith('1.')) {
      return res.status(422).send({
        code: 'old-version',
        message: `Version ${doc.asyncapi} is not supported. Please convert it to a newer version.`,
      });
    }
  }

  next();
};
