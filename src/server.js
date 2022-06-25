import express from "express";
import usersRouter from "./router/users.js";
import productsRouter from "./router/products.js";
import categoriesRouter from "./router/categories.js";
import subCategoriesRouter from "./router/subCategories.js";

import fs from 'fs'
import path from "path";

const PORT = process.env.PORT || 6006;

const app = express();

app.use(express.json());

app.use(usersRouter);
app.use(categoriesRouter);
app.use(subCategoriesRouter);
app.use(productsRouter);



app.use((error, req, res, next) => {
  if (error.status != 500) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  let date = new Date(Date.now());
    date = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
  });

  // fs.appendFileSync(
    // path.join(process.cwd(), "src", "log.txt"),
    // `${req.url}___${error.name}___${error.message}___${
      // error.status
    // }___${date}\n`
  // );

  res.status(error.status).json({
    status: error.status,
    message: "InternalServerError",
  });

  process.exit();
});



app.listen(PORT, () => console.log(`*${PORT}`));
