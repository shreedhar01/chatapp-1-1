import bcrypt from "bcrypt"

export const hashPassword = async (pass: string) => {
    return await bcrypt.hash(pass, 10)
}

export const comparePassword = async (pass: string, dbPass: string) => {
    return await bcrypt.compare(pass, dbPass)
}