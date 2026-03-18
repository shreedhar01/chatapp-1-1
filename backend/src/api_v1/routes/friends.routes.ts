import {
    Router,
    type Router as ExpressRouter
} from "express";
import { authorizeUser } from "../middlewares/auth.middleware.js";
import {
    friendRequestController,
    getAllFriendController,
    getAllFriendRequestController,
    responseFriendRequestController,
    searchFriendController
} from "../controller/friends.controller.js";

const router: ExpressRouter = Router()

router.route("/search").post(authorizeUser, searchFriendController)
router.route("/add").post(authorizeUser, friendRequestController)
router.route("/accepted").get(authorizeUser, getAllFriendController)
router.route("/")
    .get(authorizeUser, getAllFriendRequestController)
    .post(authorizeUser, responseFriendRequestController)

export default router