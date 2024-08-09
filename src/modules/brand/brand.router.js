import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multerLocal.js";
import systemRoles from "../../utils/systemRoles.js";
import { validateRequest } from "../../middleware/validation.js";
import * as BV from "./brand.validation.js";
import * as BC from "./brand.controller.js";
const router = express.Router();
router.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validateRequest(BV.addBrandValidation),
  auth(),
  authorization(systemRoles.admin),
  BC.addBrand
);
router.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validateRequest(BV.updateBrandValidation),
  auth(),
  authorization(systemRoles.admin),
  BC.updateBrand
);
router.delete(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validateRequest(BV.deleteCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  BC.deleteBrand
);
router.get(
  "/getBrands",
  multerHost(validExtension.image).single("image"),
  validateRequest(BV.getBrandValidation),
  auth(),
  authorization(systemRoles.admin),
  BC.getBrand
);
router.get(
  "/",
  multerHost(validExtension.image).single("image"),
  validateRequest(BV.getAllBrandsValidation),
  auth(),
  authorization(systemRoles.admin),
  BC.getBrands
);
export default router;
