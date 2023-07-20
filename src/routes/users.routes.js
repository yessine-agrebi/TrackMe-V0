import express from 'express'
import { usersController } from '../controllers/users.controller.js';
import { authController } from '../controllers/auth.controller.js';
import { createUserValidator } from '../utils/authValidator.js';
const router = express.Router();


router.get('/', usersController.getAllUsers);
router.get('/:id', authController.protect, usersController.getOneUser);
router.post('/', authController.protect, createUserValidator, usersController.createUser );
router.put('/:id', authController.protect, usersController.updateUser);
router.delete('/:id', authController.protect, usersController.deleteuser);


export default router;