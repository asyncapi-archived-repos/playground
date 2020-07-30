const AsyncAPIParser = require('@asyncapi/parser');
const AvroSchemaParser = require('@asyncapi/avro-schema-parser');

function checkVersion (doc, res) {
  if (doc && doc.asyncapi && doc.asyncapi.startsWith('1.')) {
    return res.status(422).send({
      code: 'old-version',
      message: `Version ${doc.asyncapi} is not supported. Please convert it to a newer version.`,
    });
  }
  if (doc && doc.asyncapi && doc.asyncapi.startsWith('2.0.0-rc')) {
    return res.status(422).send({
      code: 'unsupported-version',
      message: `Version ${doc.asyncapi} is not supported. Use version 2.0.0 instead.`,
    });
  }

  return false;
}

module.exports = async (req, res, next) => {
  if (req.body) {
    let parsed

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
    };

    try {
      AsyncAPIParser.registerSchemaParser(AvroSchemaParser);
      parsed = await AsyncAPIParser.parse(req.body, parserOptions);
      checkVersion(parsed.json(), res);
      next();
    } catch (e) {
      console.error(e);
      e.code = 'invalid';
      if (checkVersion(e.parsedJSON, res) === false) {
        return next(e);
      }
    }
  }
};
