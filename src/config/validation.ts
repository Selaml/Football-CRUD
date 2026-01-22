import * as Joi from 'joi';

/** This code exports a validation schema object created using the Joi library. The schema defines the
expected shape and types of environment variables that will be used in a Node.js application. The
schema includes validation rules for various environment variables such as `NODE_ENV`, `APP_NAME`,
`APP_DESCRIPTION`, `APP_VERSION`, `APP_PORT`, `APP_IS_PRODUCTION`, `POSTGRES_HOST`, `POSTGRES_PORT`,
`POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`. This schema can be used to validate the
environment variables before the application starts running to ensure that they meet the expected
requirements. */

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),

  DB_URI: Joi.string().optional(),
  DB_HOST: Joi.string().optional(),

});
