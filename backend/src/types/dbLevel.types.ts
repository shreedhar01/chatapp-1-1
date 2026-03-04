import { createInsertSchema } from "drizzle-zod";
import {
  users
} from "../db/schema.js"
import z from "zod";




export const registerUserSchema = createInsertSchema(users)
  .omit({
    status: true,
    last_seen: true,
    created_at: true
  })
  .extend({
    name: z.string().min(3).max(255),
    email: z.string().min(6).max(255),
  });
export type RegisterUser = z.infer<typeof registerUserSchema>;


export const loginUserSchema = createInsertSchema(users)
  .omit({
    name: true,
    status: true,
    last_seen: true,
    created_at: true
  })
  .extend({
    email: z.string().min(6).max(255),
  });
export type LoginUser = z.infer<typeof loginUserSchema>;