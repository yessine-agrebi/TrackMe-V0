import express from "express";
import { usersController } from "../controllers/users.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { createUserValidator } from "../utils/authValidator.js";
const router = express.Router();

router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getOneUser);
router.post("/", createUserValidator, usersController.createUser);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteuser);

export default router;
