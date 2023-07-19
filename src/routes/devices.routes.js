import express from 'express';
import { devicesController } from '../controllers/devices.controller.js';
import { authController } from '../controllers/auth.controller.js';

const router = express.Router();



router.get('/',authController.protect , devicesController.getAllDevices)
router.get('/:id', devicesController.getDeviceById)
router.get('/:id/position', devicesController.getDevicePosition)
router.post('/', devicesController.addDevice)


export default router