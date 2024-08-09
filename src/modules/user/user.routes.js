import express from "express";
import * as UC from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

router.post("/", UC.signUp);
router.get("/verifyUser/:token", UC.verifyUser);
router.post("/signIn", UC.signIn);
router.get("/refreshToken/:rfToken", UC.refreshToken);
router.patch("/sendCode", UC.forgetPassword);
router.patch("/resetPassword", UC.resetPassword);
router.get("/getInfo", auth(), UC.getUser);
router.patch("/updateInfo/:id", auth(), UC.updateUser);
router.delete("/",auth(),UC.deleteUser)
export default router;
