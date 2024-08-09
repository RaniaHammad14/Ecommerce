import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
      maxLength: 30,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    customId: String,
  },
  { timestamps: true, versionKey: false }
);
const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
