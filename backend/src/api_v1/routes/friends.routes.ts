import {
    Router,
    type Router as ExpressRouter
} from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import { searchFriendController } from "../controller/friends.controller.js";

const router: ExpressRouter = Router()

router.route("/search").post(authorizeUser, searchFriendController)

export default router