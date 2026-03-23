import { Router, type Router as ExpressRouter } from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import { createNewMessageController } from "../controller/message.controller.js";

const router: ExpressRouter = Router()

router.route("/new").post(authorizeUser, createNewMessageController)

export default router