import { Router } from "express";
import controller from '../controller/products.js';
import checkToken from "../middleware/checkToken.js";



const router = Router()

router.route('/products')
    .get(controller.GET)
    .post(checkToken, controller.POST)


router.route('/products/:productId')
    .get(controller.GET)
    .put(checkToken, controller.PUT)
    .delete(checkToken, controller.DELETE)



export default router