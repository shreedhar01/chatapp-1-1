import { Router, type Router as ExpressRouter } from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import { createNewMessageController, getAllMessagesController, updateMessageStatusController } from "../controller/message.controller.js";

const router: ExpressRouter = Router()

router.route("/new").post(authorizeUser, createNewMessageController)
router.route("/")
    .get(authorizeUser, getAllMessagesController)
    .patch(authorizeUser, updateMessageStatusController)

export default router