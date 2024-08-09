import joi from "joi";
import generalField from "../../utils/generalFields.js";

export const addBrandValidation = {
  body: joi
    .object({
      name: joi.string().required().min(3).max(30),
    })
    .required(),
  file: generalField.file.required(),
  headers: generalField.headers.required(),
};
export const updateBrandValidation = {
  body: joi.object({
    name: joi.string().required().min(3).max(30),
  }),

  headers: generalField.headers.required(),
  file: generalField.file,
};
export const deleteCategoryValidation = {
  id: generalField.id.required(),

  headers: generalField.headers.required(),
  file: generalField.file,
};
export const getBrandValidation = {
  headers: generalField.headers.required(),
  file: generalField.file,
};
export const getAllBrandsValidation = {
  headers: generalField.headers.required(),
  file: generalField.file,
};