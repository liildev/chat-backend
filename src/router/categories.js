import { Router } from "express";
import controller from "../controller/categories.js";
import checkToken from "../middleware/checkToken.js";

const router = Router();

router.route("/categories")
    .get(controller.GET)
    .post(checkToken, controller.POST)


router.route("/categories/:categoryId")
    .get(controller.GET)
    .put(checkToken, controller.PUT)
    .delete(checkToken, controller.DELETE)



export default router;
