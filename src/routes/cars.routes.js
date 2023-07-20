import express from 'express';
import { carsController } from '../controllers/cars.controller.js';

const router = express.Router()


router.post('/', carsController.addCar)
router.get('/', carsController.getCars)
router.get('/:id', carsController.getOneCar)
router.put('/:id', carsController.updateCar)
router.delete('/:id', carsController.deleteCar)




export default router