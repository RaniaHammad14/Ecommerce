import joi from "joi";
import generalField from "../../utils/generalFields.js";

export const addSubCategoryValidation = {
  body: joi
    .object({
      name: joi.string().required().min(3).max(30),
    })
    .required(),
  params: joi.object({
    categoryId: generalField.id.required(),
  }),
  file: generalField.file.required(),
  headers: generalField.headers.required(),
};
export const updateSubCategoryValidation = {
  body: joi.object({
    name: joi.string().required().min(3).max(30),
    categoryId: generalField.id.required(),
  }),

  headers: generalField.headers.required(),
  file: generalField.file,
};
export const deleteSubCategoryValidation = {
  id: generalField.id.required(),

  headers: generalField.headers.required(),
  file: generalField.file,
};
export const getSubCategoriesValidation = {
  headers: generalField.headers.required(),
  file: generalField.file,
};
export const getAllSubCategoriesValidation = {
  headers: generalField.headers.required(),
  file: generalField.file,
};
