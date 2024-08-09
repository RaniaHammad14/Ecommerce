import express from "express";
import { auth, authorization } from "../../middleware/auth.js";
import { multerHost, validExtension } from "../../middleware/multerLocal.js";
import systemRoles from "../../utils/systemRoles.js";
import { validateRequest } from "../../middleware/validation.js";
import * as PV from "./product.validation.js";
import * as PC from "./product.controller.js";
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  multerHost(validExtension.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 3 },
  ]),
  
  auth(),
  authorization(systemRoles.admin),
  PC.createProduct
);

export default router;
