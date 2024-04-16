import express from "express";
import {
  deleteUserController,
  loginController,
  registerController,
  updateUserController,
  patchIsBizController,
  getAllUsersController,
  getUserByIdController,
  getMe,
  updateMeController,
} from "../../controllers/users.controller.js";
import bodyValidationMiddleware from "../../middlewares/bodyValidation.mw.js";
import {
  loginValidation,
  registerValidation,
  editUserValidation,
} from "../../validation/validationAdapter.js";
import authMiddleware from "../../middlewares/auth.mw.js";
import adminOrOwn from "../../middlewares/adminOrOwn.mw.js";
import isAdmin from "../../middlewares/isAdmin.mw.js";

import objectIdParamsValidationMiddleware from "../../middlewares/objectIdParamsValidation.mw.js";
const router = express.Router();
router.get("/me", authMiddleware, getMe)
router.get("/", authMiddleware, isAdmin, getAllUsersController);
router.get("/:id", authMiddleware, adminOrOwn, getUserByIdController)

router.post(
  "/register",
  bodyValidationMiddleware(registerValidation),
  registerController
);

router.post(
  "/login",
  bodyValidationMiddleware(loginValidation),
  loginController
);



router.put(
  "/update",
  authMiddleware,
  bodyValidationMiddleware(editUserValidation),
  updateMeController
);

router.put(
  "/:id",
  authMiddleware,
  objectIdParamsValidationMiddleware,
  adminOrOwn,
  bodyValidationMiddleware(editUserValidation),
  updateUserController
);

router.patch(
  "/:id",
  authMiddleware,
  objectIdParamsValidationMiddleware,
  adminOrOwn,
  //add patch validation
  patchIsBizController
);

router.delete(
  "/:id",
  authMiddleware,
  objectIdParamsValidationMiddleware,
  adminOrOwn,
  deleteUserController
);

export default router;
