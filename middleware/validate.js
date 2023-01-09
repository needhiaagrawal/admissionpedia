import Joi from 'joi';
import httpStatus from 'http-status';
import { pick } from '../utils/pick';


export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    let errorMessage = error.details.map((details) => details.message).join(', ');
    errorMessage = errorMessage.replaceAll('"', "");
    res.status(httpStatus.BAD_REQUEST)
    return res.send({ success: false, err: errorMessage })
  }
  Object.assign(req, value);
  return next();
};

