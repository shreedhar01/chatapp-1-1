import express from "express"

const app = express()

app.get("/",(_,res)=>{
    res.send("Backend is up and running")
})

app.listen(process.env.PORT,()=>{
     console.log("Listening on port ",process.env.PORT)
})