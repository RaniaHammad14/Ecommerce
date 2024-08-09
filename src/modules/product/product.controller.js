import productModel from "../../../connectionDB/models/product.model.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import subCategoryModel from "../../../connectionDB/models/subCategory.model.js";
import categoryModel from "../../../connectionDB/models/category.model.js";
import brandModel from "../../../connectionDB/models/brand.model.js";

//==============================================createBrand===================================//
export const createProduct = asyncHandler(async (req, res, next) => {
  const { title, description, subCategoryId, categoryId, brandId, price, stock, discount } = req.body;

  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategoryId });
  if (!subCategoryExist) {
    return next(new AppError("Subcategory doesn't exist", 501));
  }

  const categoryExist = await categoryModel.findOne({ _id: categoryId });
  if (!categoryExist) {
    return next(new AppError("Category doesn't exist", 501));
  }

  const brandExist = await brandModel.findOne({ _id: brandId });
  if (!brandExist) {
    return next(new AppError("Brand doesn't exist", 501));
  }

  const productExist = await productModel.findOne({ title: title.toLowerCase() });
  if (productExist) {
    return next(new AppError("Product already exists", 501));
  }

  const customId = nanoid(5);
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
      folder: `Ecommerce/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/Products/${customId}`,
    });
    list.push({ secure_url, public_id });

    const subPrice = price - price * ((discount || 0) / 100);
    const product = await productModel.create({
      title,
      slug: slugify(title, { replacement: "_", lower: true }),
      createdBy: req.user.id,
      subCategoryId,
      categoryId,
      brandId,
      description,
      price,
      stock,
      discount,
      image: { secure_url, public_id },
      coverImages: list,
      subPrice,
      customId,
    });

    if (product) {
      res.status(201).json({ msg: "Product added successfully", product });
    } else {
      return next(new AppError("Failed adding product", 501));
    }
  }
});

//==============================================updateBrand===================================//
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const brand = await brandModel.findOne({ _id: id, createdBy: req.user.id });
  if (!brand) {
    return next(new AppError("Brand doesn't exist", 404));
  }

  if (name) {
    if (name.toLowerCase() === brand.name) {
      return next(new AppError("Name should be different from the previous name", 400));
    }
    const existingBrand = await brandModel.findOne({ name: name.toLowerCase() });
    if (existingBrand) {
      return next(new AppError("Name already exists", 400));
    }
    brand.name = name.toLowerCase();
    brand.slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/Brands/${brand.customId}`,
    });
    brand.image = { secure_url, public_id };
  }
  const updatedData = await brand.save();
  res.status(200).json({ msg: "Brand updated successfully", updatedData });
});
//==============================================deleteBrand===================================//
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findOneAndDelete({ _id: id, createdBy: req.user.id }, { new: true });
  if (!brand) {
    return next(new AppError("Brand doesn't exist", 404));
  }
  await cloudinary.uploader.destroy(brand.image.public_id);

  res.status(200).json({ msg: "Brand deleted successfully" });
});
//==============================================getBrand===================================//
export const getBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.find({ createdBy: req.user.id }).populate({
    path: "createdBy",
    select: "name email role",
  });
  if (!brand) {
    return next(new AppError("User did not add any brand", 404));
  }

  res.status(200).json({ msg: "Done", brand });
});
//==============================================getBrands===================================//
export const getBrands = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.find().populate({
    path: "createdBy",
    select: "name email role",
  });

  res.status(200).json({ msg: "Done", brand });
});
