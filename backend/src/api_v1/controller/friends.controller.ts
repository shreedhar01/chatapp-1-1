import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { searchFriendSchema } from "../../types/friends.types.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { searchFriendService } from "../../services/friend.service.js";

export const searchFriendController = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const validData = await searchFriendSchema.safeParse(data)
    if (!validData.success) {
        const err = validData.error.issues.map((v) => ({ path: v.path, message: v.message }))
        throw new ApiError(400, "Provide Name", err)
    }
    const friends = await searchFriendService(validData.data)
    return res.status(200).json(
        new ApiResponse(200, [friends], "search result featch successfully")
    )
})


export const friendRequestController = asyncHandler(async (req: Request, res: Response) => {

})


export const responseFriendRequest = asyncHandler(async (req: Request, res: Response) => {

})