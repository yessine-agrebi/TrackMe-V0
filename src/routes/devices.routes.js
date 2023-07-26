import express from "express";
import { devicesController } from "../controllers/devices.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { Server } from "socket.io";
const io = new Server();

const router = express.Router();

router.get("/", devicesController.getAllDevices);
router.get("/:id", devicesController.getDeviceById);
router.get("/:id/position", devicesController.getDevicePosition(io));
router.get("/:id/status", devicesController.getDeviceStatus);
router.post("/", devicesController.addDevice);
router.delete("/:id", devicesController.deleteDevice);
router.patch("/:id", devicesController.updateDevice);

export default router;
