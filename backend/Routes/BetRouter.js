import express from "express"
import { Prediction, selectedPredictions } from "../controllers/BetController.js"
import { verifyToken } from "../controllers/UserController.js"


export const BetRouter = express.Router()


BetRouter.route("/").post(verifyToken, selectedPredictions)
// BetRouter.route("/list").post(verifyToken, selectedPredictions)

