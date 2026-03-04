import {
    Router,
    type Router as ExpressRouter
} from "express";
import { 
    registerUser,
    loginUser
 } from "../controller/user.controller.js";

const router: ExpressRouter = Router()

router.route("/").post(registerUser)
router.route("/login").post(loginUser)

export default router