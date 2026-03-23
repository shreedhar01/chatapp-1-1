import express, {
    type NextFunction,
    type Request, type Response
} from "express"
import type { ApiError } from "./utils/ApiError.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./api_v1/routes/user.routes.js"
import friendsRouter from "./api_v1/routes/friends.routes.js"
import messageRouter from "./api_v1/routes/message.routes.js"


const app = express()

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (_, res) => {
    res.send("Backend is up and running")
})

app.use("/user", userRouter)
app.use("/friend", friendsRouter)
app.use("/message", messageRouter)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: err.message,
        errors: err.error
    })
})

app.listen(process.env.PORT, () => {
    console.log("Listening on port ", process.env.PORT)
})