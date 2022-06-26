import express from "express"
import { Predictions } from "../controllers/BetController.js"
import { verifyToken } from "../controllers/UserController.js"


export const BetRouter = express.Router()


BetRouter.route("/").post(verifyToken, Predictions)
// BetRouter.route("/list").post(verifyToken, selectedPredictions)

