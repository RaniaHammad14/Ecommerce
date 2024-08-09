import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 60,
      unique: true,
    },
    description: {
      type: String,
      minLength: 3,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImages: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    subPrice: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      default: 1,
      required: true,
    },
    rateAvg: {
      type: Number,
      default: 0,
    },

    customId: String,
  },
  { timestamps: true, versionKey: false }
);
const productModel = mongoose.model("product", productSchema);

export default productModel;
