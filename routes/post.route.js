const express=require("express");

const {PostModel}=require("../models/post.model")
const PostRouter=express.Router();

// adding a new post

PostRouter.post("/",async(req,res)=>{
    let payload=req.body;
    try{
        let post=new PostModel(payload);
        await post.save();
        res.send("post created");
    }
    catch(err){
        res.send(err.message);
    }
})


// to see all the posts

PostRouter.get("/",async(req,res)=>{
    try{

        let posts=await PostModel.find();
        res.send(posts)

    }
    catch(err){
        res.send(err.message);
    }
})


// update a post
PostRouter.patch("/:id",async(req,res)=>{
    let payload=req.body;
    let id=req.params.id;

    try{
        await PostModel.findByIdAndUpdate(id,payload);
    }
    catch(err){
        res.send(err.message);
    }
})

// get particular id post

PostRouter.get("/:id",async(req,res)=>{
    let id=req.params.id;

    try{
        let posts=await PostModel.findById(id);
        res.send(posts);
    }
    catch(err){
       res.send(err.message);
    }
})



// delete a post

PostRouter.delete("/:id",async(req,res)=>{
    let id=req.params.id;

    try{
        await PostModel.findByIdAndDelete(id);
        res.send("the post was deleted");
    }
    catch(err){
        err.message;
    }
})


// like a post 
PostRouter.post("/:id/like",async(req,res)=>{
    let id=req.params.id;
    let uid=req.body.id;

    try{
        let post=await PostModel.findById(id);
        post.likes.push(uid);
        await post.save();

        res.send("the post was liked");
    }
    catch(err){
        res.send(err.message);
    }
})

// add comments

PostRouter.post("/:id/comment",async(req,res)=>{
    let id=req.params.id;
    let payload=req.body;
    try{
        let post=await PostModel.findById(id);
        post.comments.push(payload);
        await post.save();
        res.send("comment added");
    }
    catch(err){
        res.send(err.message);
    }
})


module.exports={
    PostRouter
}