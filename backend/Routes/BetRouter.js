import express from "express"
import { Aggressive, Passive } from "../controllers/BetController.js"
import { verifyToken } from "../controllers/UserController.js"


export const BetRouter = express.Router()


BetRouter.route("/").post(verifyToken, Passive)
BetRouter.route("/aggressive").post(verifyToken, Aggressive)


