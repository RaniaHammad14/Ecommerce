import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multerLocal.js";
import systemRoles from "../../utils/systemRoles.js";
import { validateRequest } from "../../middleware/validation.js";
import * as SCV from "./subCategory.validation.js";
import * as SCC from "./subCategory.controller.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validateRequest(SCV.addSubCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  SCC.addSubCategory
);
router.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validateRequest(SCV.updateSubCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  SCC.updateSubCategory
);
router.delete(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validateRequest(SCV.deleteSubCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  SCC.deleteSubCategory
);
router.get("/getSubCategories", validateRequest(SCV.getSubCategoriesValidation), auth(), authorization(systemRoles.admin), SCC.getSubCategory);
router.get("/", validateRequest(SCV.getAllSubCategoriesValidation), auth(), authorization(systemRoles.admin), SCC.getSubCategories);
export default router;
