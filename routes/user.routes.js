const express=require("express");

const {UserModel}=require("../models/user.model");

const UserRouter=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

// all the user routes

// to get all the users
UserRouter.get("/",async(req,res)=>{

    try{
        const users=await UserModel.find();

        res.send(users);
    }
    catch(err){
        res.send(err.message);
    }
    
})

// to add a user

UserRouter.post("/register",async(req,res)=>{
    try{

        let payload =req.body;
        bcrypt.hash(payload.password,5,async(err,hashedPassword)=>{
                if(err){
                    res.send("the password did not match");
                }
                else if(hashedPassword){
                    payload.password=hashedPassword;
                    let userData=new UserModel(payload);
                    await userData.save();
                    res.send("the user has been registered");
                }
            })


    }
    catch(err){
        res.send(err.message);
    }
})


// login the user

UserRouter.post("/login",async(req,res)=>{
    let payload=req.body;

    try{
        let user=await UserModel.find({email:payload.email});

        if(user.length>0){
           bcrypt.compare(payload.password,user[0].password,async(err,result)=>{
            if(result){
               let token= jwt.sign({userId:user[0]._id},"himanshu");
               res.status(201).send({"message":"user logged in", "token":token});
            }
           })
        }
    }
    catch(err){
        res.send("user not found");
    }
})


// sending the friend request

UserRouter.post("/:id/friends",async(req,res)=>{
    const fid=req.params.id;

    const data=await UserModel.findOne({email:req.body.email});

    try{
        if(data){
            await UserModel.updateOne({_id:data._id},{$push:{friendRequests:fid}});
            res.send("the request was sent");
        }
        else{
            res.send("req not sent");
        }
    }
    catch(err){
        res.send(err.message);
    }
})

// get all friends of a user
UserRouter.get("/:id/friends",async(req,res)=>{
    let id=req.params.id;

    try{
        let user=await UserModel.findById(id);
        let friends=user.friends;
        res.send({friends,user});
    }
    catch(err){
        res.send(err.message);
    }
})


// reject or accept friend request

UserRouter.patch("/:id/friends/:fid",async(req,res)=>{
    const fid=req.params.id;

    const data=await UserModel.findOne({email:req.body.email});

    try{
        if(data){
            await UserModel.updateOne({_id:data._id},{$pull:{friendRequests:fid}});
            res.send("the request was rejected");
        }
        else{
            res.send("req could not get rejected");
        }
    }
    catch(err){
        res.send(err.message);
    }
})



module.exports={
    UserRouter
}