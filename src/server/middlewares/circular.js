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
          console.error('The schema contains circular references');
          return res.status(422).send({
            code: 'invalid',
            message: 'The document contains circular references.',
          });
        }

        next();
      })
      .catch((err) => {
        console.error(err);
        return res.status(422).send({
          code: 'unexpected',
          message: err.message || 'Unexpected error',
        });
      });
  } else {
    next();
  }
};
