import { read, write } from "../utils/model.js";
import jwt from "../utils/jwt.js";
import sha256 from "sha256";
import { AuthrizationError, InternalServerError } from "../error/error.js";

const GET = (req, res, next) => {
  try {
    let users = read('users')
    let { userId } = req.params
    
    if(userId) {
      let [user] = read("users").filter((user) => user.userId == userId);
      delete user.password
      return res.status(200).send(user);
    }

    users = read("users").filter((user) => delete user.password);
    res.status(200).send(users);
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const REGISTER = (req, res, next) => {
  try {
    console.log(req.file);
    let users = read("users");

    let user = users.find((user) => user.username == req.body.username);

    if (user) {
      if (user) {
        return next(
          new AuthrizationError(401, "this username is already taken")
        );
      }
    }

    req.body.userId = users.length ? users.at(-1).userId + 1 : 1;
    req.body.password = sha256(req.body.password);
    req.body.avatar = req.file.filename;

    users.push(req.body);
    write("users", users);

    delete req.body.password;
    res.status(201).json({
      status: 201,
      message: "you are registered",
      token: jwt.sign({ userId: req.body.userId }),
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
      token: jwt.sign({ userId: user.userId }),
      data: user,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default {
  LOGIN,
  REGISTER,
  GET
};
