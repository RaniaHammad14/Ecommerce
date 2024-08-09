import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      minLength: 10,
      maxLength: 15,
    },
    address: [String],
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    code: String,
    passwordChangeAt: Date,
  },
  { timestamps: true, versionKey: false }
);
const userModel = mongoose.model("user", userSchema);

export default userModel;
