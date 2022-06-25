import { InternalServerError, notFoundError } from "../error/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let categories = read("categories");
    let subCategories = read("subCategories");

    let { categoryId } = req.params;
    if (categoryId) {
      let data = categories.find(
        (category) => category.category_id == categoryId
      );
      res.status(200).send({
        status: 200,
        message: "OK",
        data: data,
      });
    }

    let category = categories.map((category) => {
      category.subCategories = subCategories.filter(
        (subCategory) => subCategory.category_id == category.category_id
      );
      category.subCategories.filter(
        (subcategory) => delete subcategory.category_id
      );

      return category;
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: category,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    let categories = read("categories");

    let newCategory = {
      category_id: categories.length ? categories.at(-1).category_id + 1 : 1,
      category_name: req.body.categoryName,
    };
    categories.push(newCategory);
    write("categories", categories);

    res.status(201).send({
      status: 201,
      message: "New category added",
      data: newCategory,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const PUT = (req, res, next) => {
  try {
    let categories = read("categories");
    let users = read("users");

    let { categoryId } = req.params;

    let category = categories.find(
      (category) =>
        category.category_id == categoryId &&
        users.find((user) => user.user_id == req.user_id)
    );

    if (!category) {
      return next(new notFoundError(404, "category not found"));
    }

    category.category_name = req.body.categoryName || category.category_name;
    write("categories", categories);

    category.user = users.find((user) => user.user_id == req.user_id);
    delete category.user_id;
    delete category.user.password;

    res.status(200).json({
      status: 200,
      message: "Category updated",
      data: category,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    let categories = read("categories");
    let users = read("users");

    let { categoryId } = req.params;

    let categoryIndex = categories.findIndex(
      (category) =>
        category.category_id == categoryId &&
        users.find((user) => user.user_id == req.user_id)
    );

    if (categoryIndex == -1) {
      return next(new notFoundError(404, "category not found"));
    }

    let [category] = categories.splice(categoryIndex, 1);
    write("categories", categories);

    category.user = users.find((user) => user.user_id == req.user_id);
    delete category.user.password;

    res.status(200).json({
      status: 200,
      message: "Category deleted",
      data: category,
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
