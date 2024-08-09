import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multerLocal.js";
import systemRoles from "../../utils/systemRoles.js";
import { validateRequest } from "../../middleware/validation.js";
import * as CV from "./category.validation.js";
import * as CC from "./category.controller.js";
import subCategoryRouter from "../subCategory/subCategory.routers.js";
const router = express.Router();

router.use("/:categoryId/subCategory", subCategoryRouter);

router.post(
  "/",
  multerHost(validExtension.image).single("image"),
  validateRequest(CV.addCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  CC.addCategory
);
router.patch(
  "/:id",
  multerHost(validExtension.image).single("image"),
  validateRequest(CV.updateCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  CC.updateCategory
);
router.delete(
  "/:id",

  validateRequest(CV.deleteCategoryValidation),
  auth(),
  authorization(systemRoles.admin),
  CC.deleteCategory
);
router.get("/getCategories", validateRequest(CV.getCategoriesValidation), auth(), authorization(systemRoles.admin), CC.getCategory);
router.get("/", validateRequest(CV.getAllCategoriesValidation), auth(), authorization(systemRoles.admin), CC.getCategories);
export default router;
