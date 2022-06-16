import express from "express";
import usersRouter from "./router/users.js";
import messageRouter from "./router/messages.js";
import cors from 'cors'
import fs from 'fs'
import path from "path";

const PORT = process.env.PORT || 5005;

const app = express();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'uploads')))
app.use(cors())
app.use(usersRouter);
app.use(messageRouter);


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

  fs.appendFileSync(
    path.join(process.cwd(), "src", "log.txt"),
    `${req.url}___${error.name}___${error.message}___${
      error.status
    }___${date}\n`
  );

  res.status(error.status).json({
    status: error.status,
    message: "InternalServerError",
  });

  // process.exit();
});



app.listen(PORT, () => console.log(`*${PORT}`));

// let numbers = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
// ];

// function paginate(data, page, limit) {
//   return {
//       results : data.slice((page-1) * limit, limit*page),
//       pages: Math.ceil(data.length / limit)
//   }
// }

// console.log(paginate(numbers, 1, 5));
