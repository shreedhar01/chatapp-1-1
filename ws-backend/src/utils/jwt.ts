import jwt, { type JwtPayload } from "jsonwebtoken"
import type { IJwtPlayload } from "../types/jwt.types.js"
import { config } from "../config/env.js";

export type IDecodedJwt = IJwtPlayload & JwtPayload;

export const verifyJwt = async(token: string)=>{
    return await jwt.verify(token,config.JWT_SECRET || "") as IDecodedJwt
}