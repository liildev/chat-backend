import { InternalServerError, notFoundError } from "../error/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let subCategories = read("subCategories");
    let products = read("products");

    let { subcategoryId } = req.params;
    console.log(subcategoryId);
    if (subcategoryId) {
      let subCategory = subCategories.find(
        (subCategory) => subCategory.sub_category_id == subcategoryId
      );
      res.status(200).send({
        status: 200,
        message: "OK",
        data: subCategory,
      });
    }

    let subCategory = subCategories.map((subCategory) => {
      subCategory.products = products.filter(
        (product) => product.sub_category_id == subCategory.sub_category_id
      );
      subCategory.products.filter((product) => delete product.sub_category_id);

      return subCategory;
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: subCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    let subCategories = read("subCategories");

    let newSubCotegory = {
      sub_category_id: subCategories.length
        ? subCategories.at(-1).sub_category_id + 1
        : 1,
      sub_category_name: req.body.subCategoryName,
      category_id: req.body.categoryId,
    };
    subCategories.push(newSubCotegory);
    write("subCategories", subCategories);

    res.status(201).send({
      status: 201,
      message: "New subcategory added",
      data: newSubCotegory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const PUT = (req, res, next) => {
  try {
    let subCategories = read("subCategories");
    let users = read("users");

    let { subcategoryId } = req.params;

    let subCategory = subCategories.find(
      (subCategory) =>
        subCategory.sub_category_id == subcategoryId &&
        users.find((user) => user.user_id == req.user_id)
    );

    if (!subCategory) {
      return next(new notFoundError(404, "Subctegory not found"));
    }

    subCategory.sub_category_name =
      req.body.subCategoryName || subCategory.sub_category_name;
    write("subCategories", subCategories);

    subCategory.user = users.find((user) => user.user_id == req.user_id);
    delete subCategory.user_id;
    delete subCategory.user.password;

    res.status(200).json({
      status: 200,
      message: "Subcategory updated",
      data: subCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    let subCategories = read("subCategories");
    let users = read("users");

    let { subcategoryId } = req.params;

    let subCategoryIndex = subCategories.findIndex(
      (subCategory) =>
        subCategory.sub_category_id == subcategoryId &&
        users.find((user) => user.user_id == req.user_id)
    );

    if (subCategoryIndex == -1) {
      return next(new notFoundError(404, "subCategory not found"));
    }

    let [subCategory] = subCategories.splice(subCategoryIndex, 1);
    write("subCategories", subCategories);

    subCategory.user = users.find((user) => user.user_id == req.user_id);
    delete subCategory.user.password;

    res.status(200).json({
      status: 200,
      message: "Subategory deleted",
      data: subCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.product));
  }
};

export default {
  GET,
  POST,
  PUT,
  DELETE
};
