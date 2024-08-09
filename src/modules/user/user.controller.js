import userModel from "../../../connectionDB/models/user.model.js";
import AppError from "../../utils/appError.js";
import { asyncHandler } from "../../utils/globalHandlingError.js";
import sendEmail from "../../../services/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";

//==============================================signUp===================================//
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, password, cPassword, email, phone, age, address, role } = req.body;
  const emailExist = await userModel.findOne({ email: email.toLowerCase() });
  emailExist && next(new AppError("User already exists", 501));

  const token = jwt.sign({ email }, "generateEmailToken", { expiresIn: 60 * 2 });
  const link = `${req.protocol}://${req.headers.host}/users/verifyUser/${token}`;
  const rfToken = jwt.sign({ email }, "generateEmailTokenRf");
  const rfLink = `${req.protocol}://${req.headers.host}/users/refreshToken/${rfToken}`;

  await sendEmail(email, "Verify Your Email", `<a href="${link}">Click here to verify</a> <br> <a href="${rfLink}">Click here to resend</a>`);

  const hash = bcrypt.hashSync(password, Number(process.env.saltRounds));
  const user = new userModel({ name, password: hash, cPassword, email, phone, age, address, role });
  const newUser = await user.save();
  newUser ? res.status(201).json({ msg: "User added successfully", user }) : next(new AppError("Failed adding user", 501));
});
//==============================================verifyUser===================================//

export const verifyUser = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, "generateEmailToken");
  if (!decoded?.email) {
    return next(new AppError("Invalid token", 501));
  }
  const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true });

  user ? res.status(201).json({ msg: "User added successfully", user }) : next(new AppError("Failed to confirm or user already confirmed", 501));
});

//==============================================refreshToken===================================//

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { rfToken } = req.params;
  const decoded = jwt.verify(rfToken, "generateEmailTokenRf");
  if (!decoded?.email) {
    return next(new AppError("Invalid token", 501));
  }
  const user = await userModel.findOne({ email: decoded.email, confirmed: true });
  if (user) {
    return next(new AppError("User already verified", 501));
  }
  const token = jwt.sign({ email: decoded.email }, "generateEmailToken", { expiresIn: 60 * 2 });
  const link = `${req.protocol}://${req.headers.host}/users/verifyUser/${token}`;
  await sendEmail(decoded.email, "verify Your Email", `<a href="${link}>Click here to verify</a>`);
  return res.status(201).json({ msg: "Done" });
});

//==============================================forgetPassword===================================//

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User not found", 501));
  }
  const code = customAlphabet("0123456789", 6);
  const newCode = code();
  await sendEmail(email, "Code for reset password", `<h1>your code is ${newCode}</h1>`);
  await userModel.updateOne({ email }, { code: newCode });
  return res.status(201).json({ msg: "Done" });
});
//==============================================resetPassword===================================//

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await userModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(new AppError("User not found", 501));
  }
  const checkCode = await userModel.findOne({ code });
  if (checkCode) {
    const hash = bcrypt.hashSync(password, Number(process.env.saltRounds));
    await userModel.updateOne({ email }, { password: hash, code: null, passwordChangeAt: Date.now() });

    return res.status(201).json({ msg: "Password updated successfully" });
  }
  return next(new AppError("Invalid code", 501));
});
//==============================================signIn========================================//

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("User Not Found", 400));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid Password", 501));
  }
  user.loggedIn = true;
  await user.save();
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, password: user.password, phone: user.phone, address: user.address, role: user.role },
    "eco"
  );

  return res.status(200).json({ msg: "done", token });
});
//==============================================getUser========================================//
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 501));
  }
  res.status(200).json({ msg: "done", user });
});
//==============================================updateUser========================================//

export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, password } = req.body;
  const user = await userModel.findByIdAndUpdate({ _id: id }, { name, email, phone, address, password }, { new: true });
  if (!user) {
    return next(new AppError("User not found", 501));
  }

  res.status(200).json({ msg: "User Updated Successfully", user });
});
//==============================================deleteUser========================================//

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const user = await userModel.findByIdAndDelete({ _id: id });
  if (!user) {
    return next(new AppError("User not found", 501));
  }

  res.status(200).json({ msg: "Deleted Successfully" });
});
