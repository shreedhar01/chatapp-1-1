import jwt, { type JwtPayload } from "jsonwebtoken"
import type { IJwtPlayload } from "../types/jwt.types.js"

export type IDecodedJwt = IJwtPlayload & JwtPayload;

export const signJwt = async(data:IJwtPlayload)=>{
    return await jwt.sign(data,process.env.JWT_SECRET || "")
}

export const verifyJwt = async(token: string)=>{
    return await jwt.verify(token,process.env.JWT_SECRET || "") as IDecodedJwt
}