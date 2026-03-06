import {
    Router,
    type Router as ExpressRouter
} from "express";
import { 
    registerUser,
    loginUser,
    logoutUser,
    me
 } from "../controller/user.controller.js";
import { authorizeUser } from "../middlewares/auth.middleware.js";

const router: ExpressRouter = Router()

router.route("/").post(registerUser).get(authorizeUser,me)
router.route("/login").post(loginUser)
router.route("/logout").post(authorizeUser,logoutUser)

export default router