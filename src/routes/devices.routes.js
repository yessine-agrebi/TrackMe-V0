import express from "express";
import { devicesController } from "../controllers/devices.controller.js";
import { authController } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", authController.protect, devicesController.getAllDevices);
router.get("/:id", authController.protect, devicesController.getDeviceById);
router.get(
  "/:id/position",
  authController.protect,
  devicesController.getDevicePosition
);
router.post("/", authController.protect, devicesController.addDevice);
router.delete("/:id", authController.protect, devicesController.deleteDevice);

export default router;
