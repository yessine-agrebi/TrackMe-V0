import express from 'express'
import {historyController} from '../controllers/history.controller.js'
const router = express.Router();


router.get('/:id', historyController.getHistory)



export default router;