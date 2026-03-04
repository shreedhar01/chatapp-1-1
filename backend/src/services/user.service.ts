import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { RegisterUser } from "../types/dbLevel.types.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword } from "../utils/bcrypt.js";
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

    const token = await signJwt({ id: userRegistered.id.toString(), name: userRegistered.name })

    return {
        token,
        name: userRegistered.name,
        email: userRegistered.email
    }
}