import {
    Router,
    type Router as ExpressRouter
} from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import { friendRequestController, searchFriendController } from "../controller/friends.controller.js";

const router: ExpressRouter = Router()

router.route("/search").post(authorizeUser, searchFriendController)
router.route("/add").post(authorizeUser,friendRequestController)

export default router