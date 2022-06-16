import { Router } from "express";
import controller from '../controller/users.js';
import { avatar } from "../middleware/upload.js";
import validation from '../middleware/validation.js'
const router = Router()



router.get('/users', controller.GET)
router.get('/users/:userId', controller.GET)


router.post('/register', avatar, validation, controller.REGISTER)
router.post('/login', validation, controller.LOGIN)



export default router