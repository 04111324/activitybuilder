const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function validateEvent(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const error = new Error("Event validation failed");
    error.details = validate.errors;
    throw error;
  }

  return true;
}

module.exports = { validateEvent };
