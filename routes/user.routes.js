import express from "express";
import { allUsers, userDetail } from "../controller/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/detail/:id", userDetail);
userRoutes.get("/list", allUsers);

export { userRoutes };
