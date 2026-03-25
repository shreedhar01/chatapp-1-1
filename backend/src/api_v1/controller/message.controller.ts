import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createNewMessageService, getAllMessagesService } from "../../services/message.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createNewMessageSchema } from "../../types/message.types.js";
import { ApiError } from "../../utils/ApiError.js";

export const createNewMessageController = asyncHandler(async (req: Request, res: Response) => {
    const isDataValid = await createNewMessageSchema.safeParse(req.body)
    if (!isDataValid.success) {
        const err = isDataValid.error.issues.map((v) => ({ path: v.path, message: v.message }))
        throw new ApiError(422, "validation error", err)
    }

    const message = await createNewMessageService(isDataValid.data, req.user!.id)
    return res.status(200).json(
        new ApiResponse(200, [message], "Message creatd successfully")
    )
})


export const getAllMessagesController = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, friendId } = req.query

    const friendIdNumber = typeof friendId === "string" ? Number(friendId) : undefined;
    if (!friendIdNumber) {
        throw new ApiError(400, "Invalid friend Id")
    }

    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.min(50, Number(limit) || 20)

    const message = await getAllMessagesService(pageNumber, limitNumber, friendIdNumber, req.user!.id)

    return res.status(200).json(
        new ApiResponse(200, [message], "all message fetch successfully")
    )
})