import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { verifyJwt } from "../../utils/jwt.js";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const authorizeUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.login || req.headers.authorization?.split(" ")[1]
    if(!token){
        throw new ApiError(400,"No cookie provided")
    }

    
    const validToken = await verifyJwt(token)
    if(!validToken){
        throw new ApiError(400,"Invalid token provided")
    }
    if(new Date() > new Date(validToken?.iat!*1000 + Number(process.env.JWT_LIFE || 0))){
        throw new ApiError(400, "Cookie timeout")
    }

    const [validUser] = await db.select().from(users).where(eq(users.id, Number(validToken.id)))
    if(!validUser){
        throw new ApiError(400, "User doesn't exist")
    }

    req.user = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email
    }
    
    next()
})