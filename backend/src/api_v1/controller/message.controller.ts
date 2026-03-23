import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createNewMessageService } from "../../services/message.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createNewMessageController = asyncHandler(async(req: Request, res: Response)=>{
    const message = createNewMessageService()
    return res.status(200).json(
        new ApiResponse(200,[],"Message creatd successfully")
    )
})