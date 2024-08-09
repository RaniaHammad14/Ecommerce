import categoryModel from "../../../connectionDB/models/category.model.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import subCategoryModel from "../../../connectionDB/models/subCategory.model.js";

//==============================================addCategory===================================//
export const addCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() });
  categoryExist && next(new AppError("Category already exists", 501));
  if (!req.file) {
    return next(new AppError("Please upload image", 400));
  }
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/Categories/${customId}`,
  });

  const category = await categoryModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    createdBy: req.user.id,
    customId,
  });
  category ? res.status(201).json({ msg: "Category added successfully", category }) : next(new AppError("Failed adding category", 501));
});

//==============================================updateCategory===================================//
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findOne({ _id: id, createdBy: req.user.id });
  if (!category) {
    return next(new AppError("Category doesn't exist", 404));
  }

  if (name) {
    if (name.toLowerCase() === category.name) {
      return next(new AppError("Name should be different from the previous name", 400));
    }
    const existingCategory = await categoryModel.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      return next(new AppError("Name already exists", 400));
    }
    category.name = name.toLowerCase();
    category.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/Categories/${category.customId}`,
    });
    category.image = { secure_url, public_id };
    await category.save();
  }

  res.status(200).json({ msg: "Category updated successfully", category });
});
//==============================================deleteCategory===================================//
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndDelete({ _id: id, createdBy: req.user.id }, { new: true });
  if (!category) {
    return next(new AppError("Category doesn't exist", 404));
  }
  await cloudinary.uploader.destroy(category.image.public_id);

  res.status(200).json({ msg: "Category deleted successfully" });
});
//==============================================getCategory===================================//
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.find({ createdBy: req.user.id }).populate({
    path: "createdBy",
    select: "name email role",
  });
  if (!category) {
    return next(new AppError("User did not add any categories", 404));
  }

  res.status(200).json({ msg: "Done", category });
});
//==============================================getCategories===================================//
export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await categoryModel.find({}).populate([
    {path:"subCategories"}
  ])

  res.status(200).json({ msg: "Done", categories });
});
