import express from "express"
import { Prediction } from "../controllers/BetController.js"
import { verifyToken } from "../controllers/UserController.js"


export const BetRouter = express.Router()


BetRouter.route("/").post(verifyToken, Prediction)
