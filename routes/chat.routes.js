import express from "express";
import {
    createChat,
    chatDetail,
    addUserToChat,
    deleteUserFromChat,
    addCommentToChat,
    deleteCommentFromChat,
} from "../controller/chat.controller.js";

const chatRoutes = express.Router();

chatRoutes.post("/create/:id", createChat);
chatRoutes.get("/detail/:id", chatDetail);
chatRoutes.post("/add/user/:chatId", addUserToChat);
chatRoutes.post("/add/comment/:chatId", addCommentToChat);
chatRoutes.delete("/remove/user/:chatId", deleteUserFromChat);
chatRoutes.delete("/remove/comment/:commentId", deleteCommentFromChat);

export { chatRoutes };
