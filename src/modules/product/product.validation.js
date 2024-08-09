import joi from "joi";
import generalField from "../../utils/generalFields.js";

export const createProductValidation = {
  body: joi
    .object({
      title: joi.string().required().min(3).max(30).required(),
      description: joi.string().min(3).max(500),
      price: joi.number().positive().min(1).required(),
      subPrice: joi.number().positive().min(0).required(),
      stock: joi.number().min(0).integer().positive().required(),
      categoryId: generalField.id.required(),
      brandId: generalField.id.required(),
      discount: joi.number().min(1).integer().positive(),
      subCategoryId: generalField.id.required(),
    })
    .required(),
  files: joi.object({
    image: joi.array().items(generalField.file.required()).required(),
    coverImages: joi.array().items(generalField.file.required()).required(),
  }),
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