import { Router } from "express";
import controller from '../controller/users.js';
import validation from '../middleware/validation.js'
const router = Router()



router.post('/register', validation, controller.REGISTER)
router.post('/login', validation, controller.LOGIN)



export default router