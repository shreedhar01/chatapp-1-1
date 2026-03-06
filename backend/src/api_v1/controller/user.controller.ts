import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginUserSchema, registerUserSchema } from "../../types/dbLevel.types.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import { loginUserService, logoutUserService, registerUserService } from "../../services/user.service.js";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body
    const validData = registerUserSchema.safeParse(userData)
    if (!validData.success) {
        throw new ApiError(400, "validation error", validData.error.issues)
    }
    const { token, name, email } = await registerUserService(validData.data)
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        maxAge: Number(process.env.JWT_LIFE) || 1000 * 60 * 60 * 24, //1 day
        path: "/"
    };

    return res
        .cookie("login", token, options)
        .status(200)
        .json(
            new ApiResponse(200, [{ name, email }], "User Register Success")
        )
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const loginData = req.body
    const validData = loginUserSchema.safeParse(loginData)
    if (!validData.success) {
        throw new ApiError(400, "validation error", validData.error.issues)
    }

    const { token, name, email } = await loginUserService(validData.data)
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        maxAge: Number(process.env.JWT_LIFE) || 1000 * 60 * 60 * 24, //1 day
        path: "/"
    };

    return res
        .cookie("login", token, options)
        .status(200)
        .json(
            new ApiResponse(200, [{ name, email }], "Login Success")
        )
})

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    await logoutUserService(req.user!.id)
    return res.status(200).clearCookie("login").json(
        new ApiResponse(200, [], "Logout Success")
    )
})

export const me = asyncHandler(async (req:Request, res: Response)=>{
    const {name, email} = req.user!
    return res.status(200).json(
        new ApiResponse(200, [{name, email}], "Cool it's me")
    )
})