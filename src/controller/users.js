import { read, write } from "../utils/model.js";
import jwt from "../utils/jwt.js";
import sha256 from "sha256";
import { AuthrizationError, InternalServerError } from "../error/error.js";

const REGISTER = (req, res, next) => {
  try {
    let users = read("users");

    let user = users.find((user) => user.username == req.body.username);

    if (user) {
      return next(new AuthrizationError(401, "this username is already taken"));
    }

    req.body.user_id = users.length ? users.at(-1).user_id + 1 : 1;
    req.body.password = sha256(req.body.password);

    users.push(req.body);
    write("users", users);

    delete req.body.password;
    res.status(201).json({
      status: 201,
      message: "You are registered",
      token: jwt.sign({ user_id: req.body.user_id }),
      data: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const LOGIN = (req, res, next) => {
  try {
    let users = read("users");

    let user = users.find(
      (user) =>
        user.username == req.body.username &&
        user.password == sha256(req.body.password)
    );

    if (!user) {
      return next(new AuthrizationError(401, "wrong username or password"));
    }

    delete user.password;

    res.status(200).json({
      status: 200,
      message: "You are logged",
      token: jwt.sign({ user_id: user.user_id }),
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default {
  LOGIN,
  REGISTER,
};
