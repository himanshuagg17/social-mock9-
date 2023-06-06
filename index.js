const express=require("express");
const cors=require("cors");
const {connnection}=require("./configs/db");
const {UserRouter}=require("./routes/user.routes");
const { PostModel } = require("./models/post.model");

require("dotenv").config();

const app=express();

app.get("/",(req,res)=>{
    res.send(`<h1> This is the home route </h1>`)
})

app.use(express.json());
app.use(cors());
app.use("/users",UserRouter);
app.use("/posts",PostModel);


app.listen(process.env.port,async(req,res)=>{
    await connnection;
    console.log(`The server is running at ${process.env.port}`);
})