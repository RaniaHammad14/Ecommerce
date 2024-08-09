import joi from "joi";

export const generalField = {
  email: joi
    .string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .required(),
  cPassword: joi.string().valid(joi.ref("password")).required(),
  id: joi.string().min(24).max(24).hex().required(),
  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
  }),

  headers: joi.object({
    "cache-control": joi.string(),
    "postman-token": joi.string(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    accept: joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
    token: joi.string().required(),
  }),
};

export default generalField