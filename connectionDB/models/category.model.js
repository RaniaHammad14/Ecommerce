import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
    customId: String,
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
categorySchema.virtual("subCategories", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "categoryId",
});
const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
