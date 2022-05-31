import express from "express"
import { loginUser, registerUser, putUser, deleteUser, verifyToken, confirmUser } from "../controllers/UserController.js";

export const UserRouter = express.Router()

UserRouter.route("/").post(registerUser);
UserRouter.route("/login").post(loginUser)
UserRouter.route("/reset/:id").put(verifyToken , putUser).delete(verifyToken, deleteUser);
UserRouter.route("/confirmation/:id").get(confirmUser)