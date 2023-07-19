import express from 'express'
import { usersController } from '../controllers/users.controller.js';
import { authController } from '../controllers/auth.controller.js';
const router = express.Router();


router.get('/', authController.protect, usersController.getAllUsers);
router.get('/:id', authController.protect, usersController.getOneUser);
router.post('/', authController.protect, usersController.createUser );
router.put('/:id', authController.protect, usersController.updateUser);
router.delete('/:id', authController.protect, usersController.deleteuser);


export default router;