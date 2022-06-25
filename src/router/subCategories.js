import { Router } from "express";
import controller from "../controller/subCategories.js";
import checkToken from "../middleware/checkToken.js";

const router = Router();

router.route("/subcategories")
    .get(controller.GET)
    .post(checkToken, controller.POST);


router.route("/subcategories/:subcategoryId")
    .get(controller.GET)
    .put(checkToken, controller.PUT)
    .delete(checkToken, controller.DELETE)


export default router;
