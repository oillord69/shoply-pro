const validate = (schema, source = "body") => (req, _res, next) => {
  try {
    const data = schema.parse(req[source]);
    req[source] = data;
    next();
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

module.exports = { validate };