import { Router } from "express";
import controller from '../controller/messages.js';
import checkToken from "../middleware/checkToken.js";
import { file } from "../middleware/upload.js";



const router = Router()

router.route('/messages')
    .get(checkToken, controller.GET)
    .post(checkToken, file, controller.POST)

router.get('/files', checkToken, controller.FILE)
// router.get('/admin/posts', checkToken, controller.GET)

router.route('/user/messages/:messageId')
    .put(checkToken, controller.PUT)
    .delete(checkToken, controller.DELETE)



export default router