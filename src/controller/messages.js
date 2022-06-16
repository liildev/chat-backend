import { InternalServerError, notFoundError } from "../error/error.js";
import { read, write } from "../utils/model.js";

const GET = (req, res, next) => {
  try {
    let messages = read("messages");
    let users = read("users");

    let { userId } = req.query;
    if(req.url == '/user/messages') userId = req.userId

    if (userId) {
      let message = read("messages").filter(
        (message) => message.userId == userId
      );
      return res.status(200).send(message);
    }

    messages.forEach(function (message) {
      message.user = users.find((user) => user.userId == message.userId);
      delete message.userId;
      delete message.user.password;
    });

    res.status(201).send({
      status: 201,
      message: "",
      data: messages,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const POST = (req, res, next) => {
  try {
    let messages = read("messages");

    let { userId, message } = req.body;

    let data = req.file;
    if(data == undefined && message){
      let newMessage = {
        messageId: messages.length ? messages.at(-1).messageId + 1 : 1,
        message: message,
        userId: Number(userId),
        time: Date.now(),
      };
      messages.push(newMessage);
    } else if(data && message == ""){
      let newMessage = {
        messageId: messages.length ? messages.at(-1).messageId + 1 : 1,
        userId: Number(userId),
        file: data.filename,
        time: Date.now(),
      };
      messages.push(newMessage);
    }
    

    write("messages", messages);

    res.status(201).send({
      status: 201,
      message: "Message sent",
      message: req.body,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const FILE = (req, res, next) => {
  try {
    let messages = read("messages");
    let userId = req.userId;

    let files = messages
      .filter((message) => message.file != null && message.userId == userId)
      .map((message) => {
        return {
          file: (message.file = message.file),
        };
      });

    res.status(200).send({
      status: 200,
      message: "Good",
      data: files,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const PUT = (req, res, next) => {
  try {
    let messages = read("messages");
    let users = read("users");

    let { messageId } = req.params;
    console.log(messageId);

    let message = messages.find(
      (message) => message.messageId == messageId && message.userId == req.userId
    );

    if (!message) {
      return next(new notFoundError(404, "message not found"));
    }

    message.message = req.body.message || message.message;
    write("messages", messages);

    message.user = users.find((user) => user.userId == req.userId);
    delete message.userId;
    delete message.user.password;

    res.status(200).json({
      status: 200,
      message: "Message updated",
      data: message,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

const DELETE = (req, res, next) => {
  try {
    let messages = read("messages");
    let users = read("users");

    let { messageId } = req.params;

    let messageIndex = messages.findIndex(
      (message) => message.messageId == messageId && message.userId == req.userId
    );

    if (messageIndex == -1) {
      return next(new notFoundError(404, "message not found"));
    }

    let [message] = messages.splice(messageIndex, 1);
    write("messages", messages);

    message.user = users.find((user) => user.userId == req.userId);
    delete message.userId;
    delete message.user.password;

    res.status(200).json({
      status: 200,
      message: "Message deleted",
      data: message,
    });
  } catch (error) {
    return next(new InternalServerError(500, error.message));
  }
};

export default {
  GET,
  POST,
  FILE,
  PUT,
  DELETE,
};
