import {
    Router,
    type Router as ExpressRouter
} from "express";
import { registerUser } from "../controller/user.controller.js";

const router: ExpressRouter = Router()

router.route("/").post(registerUser)

export default router