import express from "express"
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

const app = express()

app.get("/",(_,res)=>{
    res.send("Backend is up and running")
})

app.listen(process.env.PORT,()=>{
     console.log("Listening on port ",process.env.PORT)
})