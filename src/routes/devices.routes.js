import express from 'express';
import { devicesController } from '../controllers/devices.controller.js';

const router = express.Router();



router.get('/', devicesController.getAllDevices)
router.post('/', devicesController.addDevice)


export default router