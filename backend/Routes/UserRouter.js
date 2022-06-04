import express from "express"
import { resetByEmail, loginUser, registerUser, putUser, deleteUser, verifyToken, confirmUser, resetPass, isToken } from "../controllers/UserController.js";

export const UserRouter = express.Router()

UserRouter.route("/").post(isToken , registerUser).delete(verifyToken, deleteUser);;
UserRouter.route("/login").post(isToken ,loginUser)
UserRouter.route("/reset/:id").put(verifyToken , putUser)
UserRouter.route("/confirmation/:id").get(confirmUser)
UserRouter.route("/reset").post(resetPass)
UserRouter.route("/email/reset/:link").get(resetByEmail)