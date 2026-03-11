export const config = {
    PORT:8080,
    REST_API_BACKEND:`${process.env.REST_API_BACKEND}`,
    JWT_SECRET:`${process.env.JWT_SECRET}`,
    JWT_LIFE:`${process.env.JWT_LIFE}`
}