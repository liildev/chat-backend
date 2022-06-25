import { InternalServerError, notFoundError } from "../error/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let categories = read("categories");
    let products = read("products");

    let { categoryId, model, subCategoryId, color } = req.query;
    let { productId } = req.params;

    if(subCategoryId) {
      let product = products.filter((product) => product.sub_category_id == subCategoryId);
      res.status(200).send({
        status: 200,
        message: "OK",
        data: product,
      });
    }

    if (productId) {
      let product = products.find((product) => product.product_id == productId);
      res.status(200).send({
        status: 200,
        message: "OK",
        data: product,
      });
    }

    if (categoryId) {
      let category = categories.find(
        (category) => category.category_id == categoryId
      );

      res.status(200).send({
        status: 200,
        message: "OK",
        data: category,
      });
    }

    let data = products.filter((product) => {
      let byModel =
        model && subCategoryId
          ? product.sub_category_id == subCategoryId && product.model == model
          : true;
      let byColor =
        color && model
          ? product.color == color && product.model == model
          : true;

      return byModel && byColor;
    });

    res.status(200).send({
      status: 200,
      message: "OK",
      data: data,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.product));
  }
};

const POST = (req, res, next) => {
  try {
    let products = read("products");

    let { model, sub_category_id, product_name, color, price } = req.body;

    let newProduct = {
      product_id: products.length ? products.at(-1).product_id + 1 : 1,
      product_name: product_name,
      sub_category_id: sub_category_id,
      color: color,
      price: price,
      model: model,
    };
    products.push(newProduct);

    write("products", products);

    res.status(201).send({
      status: 201,
      message: "New product added",
      product: newProduct,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.product));
  }
};

const PUT = (req, res, next) => {
  try {
    let products = read("products");
    let users = read("users");

    let { productId } = req.params;

    let product = products.find(
      (product) =>
        product.product_id == productId &&
        users.find((user) => user.user_id == req.user_id)
    );

    if (!product) {
      return next(new notFoundError(404, "product not found"));
    }

    if (req.body.model) {
      product.model = req.body.model || product.model;
      write("products", products);

      res.status(200).json({
        status: 200,
        message: "Model updated",
        data: product,
      });
    }

    if (req.body.product_name) {
      product.product_name = req.body.product_name || product.product_name;
      write("products", products);
      res.status(200).json({
        status: 200,
        product: "Product name updated",
        data: product,
      });
    }

    if (req.body.color) {
      product.color = req.body.color || product.color;
      write("products", products);
      res.status(200).json({
        status: 200,
        message: "Color updated",
        data: product,
      });
    }

    if (req.body.price) {
      product.price = req.body.price || product.price;
      write("products", products);
      res.status(200).json({
        status: 200,
        message: "Price updated",
        data: product,
      });
    }

    if (req.body.subCategoryId) {
      product.sub_category_id = req.body.subCategoryId || product.sub_category_id;
      write("products", products);
      res.status(200).json({
        status: 200,
        message: "SubcategoryId updated",
        data: product,
      });
    }
  } catch (error) {
    return next(new InternalServerError(500, error.product));
  }
};

const DELETE = (req, res, next) => {
  try {
    let products = read("products");
    let users = read("users");

    let { productId } = req.params;

    let productIndex = products.findIndex(
      (product) =>
        product.product_id == productId && users.find((user) => user.user_id == req.user_id)
    );

    if (productIndex == -1) {
      return next(new notFoundError(404, "product not found"));
    }

    let [product] = products.splice(productIndex, 1);
    write("products", products);

    product.user = users.find((user) => user.user_id == req.user_id);
    delete product.user.password;

    res.status(200).json({
      status: 200,
      message: "Product deleted",
      data: product,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.product));
  }
};

export default {
  GET,
  POST,
  PUT,
  DELETE,
};
