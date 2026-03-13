import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { friendRequestSchema, searchFriendSchema } from "../../types/friends.types.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { friendRequestService, searchFriendService } from "../../services/friend.service.js";

export const searchFriendController = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const {page, limit} = req.query 
    const pageNumber = Math.max(1, Number(page) || 1)
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 20))
    const validData = await searchFriendSchema.safeParse(data)

    if (!validData.success) {
        const err = validData.error.issues.map((v) => ({ path: v.path, message: v.message }))
        throw new ApiError(400, "Provide Name", err)
    }
    const friends = await searchFriendService(validData.data,pageNumber, limitNumber, req.user?.id!)
    return res.status(200).json(
        new ApiResponse(200, [friends], "search result featch successfully")
    )
})


export const friendRequestController = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body
    const validData = friendRequestSchema.safeParse(data)
    if(!validData.success){
        const err = validData.error.issues.map((v) => ({ path: v.path, message: v.message }))
        throw new ApiError(400,"Invalid data formate",err)
    }
    const friendRequest = await friendRequestService(validData.data)
    return res.status(200).json(
        new ApiResponse(200,[friendRequest],"friend request send successfully")
    )
})


export const responseFriendRequest = asyncHandler(async (req: Request, res: Response) => {

})