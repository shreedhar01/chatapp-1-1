import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { LoginUser, RegisterUser } from "../types/dbLevel.types.js";
import { ApiError } from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signJwt } from "../utils/jwt.js";

export const registerUserService = async (data: RegisterUser) => {
    const [isUserExist] = await db.select().from(users).where(eq(users.email, data.email));
    if (isUserExist) {
        throw new ApiError(400, "User exist with this email")
    }
    const hashPass = await hashPassword(data.password)

    const [userRegistered] = await db.insert(users).values({
        name: data.name,
        email: data.email,
        password: hashPass
    }).returning()
    if (!userRegistered) {
        throw new ApiError(500, "Unable to register try again")
    }

    const token = await signJwt({
        id: userRegistered.id.toString(),
        name: userRegistered.name
    })

    return {
        token,
        name: userRegistered.name,
        email: userRegistered.email
    }
}


export const loginUserService = async (data: LoginUser) => {
    const [isUserExist] = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email));
    if (!isUserExist) {
        throw new ApiError(400, "User doesn't exist")
    }

    const isPasswordTrue = await comparePassword(data.password, isUserExist.password)
    if (!isPasswordTrue) {
        throw new ApiError(400, "Password don't match")
    }

    await db
        .update(users)
        .set({ status: "active",last_seen: new Date() })
        .where(eq(users.id, isUserExist.id))

    const token = await signJwt({
        id: isUserExist.id.toString(),
        name: isUserExist.name
    })

    return {
        token,
        name: isUserExist.name,
        email: isUserExist.email
    }
}


export const logoutUserService = async (data: number) => {
    await db.update(users)
        .set({ status: "offline", last_seen: new Date() })
        .where(eq(users.id, data));
}