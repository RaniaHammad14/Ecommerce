import subCategoryModel from "../../../connectionDB/models/subCategory.model.js";
import categoryModel from "../../../connectionDB/models/category.model.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { nanoid } from "nanoid";

//==============================================addSubCategory===================================//
export const addSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new AppError("Category not found", 404));
  }
  const subCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() });
  subCategoryExist && next(new AppError("SubCategory already exists", 501));
  if (!req.file) {
    return next(new AppError("Please upload image", 400));
  }
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/Categories/${categoryExist.customId}/subCategories/${customId}`,
  });

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    createdBy: req.user.id,
    categoryId: req.params.categoryId,
    customId,
  });
  subCategory ? res.status(201).json({ msg: "SubCategory added successfully", subCategory }) : next(new AppError("Failed adding subCategory", 501));
});
//==============================================updateCategory===================================//
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId } = req.body;
  const { id } = req.params;

  const categoryExist = await categoryModel.findById(categoryId);
  if (!categoryExist) {
    return next(new AppError("Category not found", 404));
  }

  const subCategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user.id });
  if (!subCategory) {
    return next(new AppError("Sub-category doesn't exist", 404));
  }

  if (name) {
    if (name.toLowerCase() === subCategory.name) {
      return next(new AppError("Name should be different from the previous name", 400));
    }
    const existingSubCategory = await subCategoryModel.findOne({ name: name.toLowerCase() });
    if (existingSubCategory) {
      return next(new AppError("Name already exists", 400));
    }
    subCategory.name = name.toLowerCase();
    subCategory.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    if (subCategory.image.public_id) {
      await cloudinary.uploader.destroy(subCategory.image.public_id);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}`,
    });

    subCategory.image = { secure_url, public_id };
  }

  const updatedSubCategory = await subCategory.save();

  res.status(200).json({ msg: "SubCategory updated successfully", subCategory: updatedSubCategory });
});
//==============================================deleteSubCategory===================================//
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const SubCategory = await subCategoryModel.findOneAndDelete({ _id: id, createdBy: req.user.id }, { new: true });
  if (!SubCategory) {
    return next(new AppError("SubCategory doesn't exist", 404));
  }
  await cloudinary.uploader.destroy(SubCategory.image.public_id);

  res.status(200).json({ msg: "SubCategory deleted successfully" });
});
//==============================================getSubCategory===================================//
export const getSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel
    .find({ createdBy: req.user.id })
    .populate({
      path: "createdBy",
      select: "name email role",
    })
    .populate({
      path: "categoryId",
      select: "name",
    });
  if (!subCategory) {
    return next(new AppError("User did not add any categories", 404));
  }

  res.status(200).json({ msg: "Done", subCategory });
});
//==============================================getSubCategories===================================//
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel
    .find()
    .populate({
      path: "createdBy",
      select: "name email role",
    })
    .populate({
      path: "categoryId",
      select: "name",
    });

  res.status(200).json({ msg: "Done", subCategory });
});
