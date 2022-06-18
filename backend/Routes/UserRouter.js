import express from "express"
import { resetByEmail, loginUser, registerUser, putUser, deleteUser, verifyToken, confirmUser, resetPass, userData , verifyEmail} from "../controllers/UserController.js";

export const UserRouter = express.Router()

UserRouter.route("/info").post(verifyToken, userData)
UserRouter.route("/").post(registerUser).delete(verifyToken, deleteUser);
UserRouter.route("/login").post(loginUser)
UserRouter.route("/reset/:id").put(verifyToken , putUser)
UserRouter.route("/confirmation/:id").get(confirmUser)
UserRouter.route("/reset").post(resetPass)
UserRouter.route("/verify").post(verifyToken ,verifyEmail)
UserRouter.route("/email/reset/:link").get(resetByEmail)