import brandModel from "../../../connectionDB/models/brand.model.js";
import userModel from "../../../connectionDB/models/user.model.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import { nanoid } from "nanoid";

//==============================================addBrand===================================//
export const addBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brandExist = await brandModel.findOne({ name: name.toLowerCase() });
  brandExist && next(new AppError("brand already exists", 501));
  if (!req.file) {
    return next(new AppError("Please upload image", 400));
  }
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/Brands/${customId}`,
  });

  const brand = await brandModel.create({
    name,
    slug: slugify(name, {
      replacement: "_",
      lower: true,
    }),
    image: { secure_url, public_id },
    createdBy: req.user.id,
    customId,
  });
  brand ? res.status(201).json({ msg: "brand added successfully", brand }) : next(new AppError("Failed adding brand", 501));
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
