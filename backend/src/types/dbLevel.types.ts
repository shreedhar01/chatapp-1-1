import { createInsertSchema } from "drizzle-zod";
import {
    users
} from "../db/schema.js"
import z from "zod";




export const userSchema = createInsertSchema(users).extend({
  name: z.string().min(3).max(255),
  email: z.string().min(6).max(255)
});