const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
         res.status(400);
         throw new Error('All fields are required');
    }
    const userExists = await User.findOne({ email: email });
    if(userExists){
        res.status(400);
        throw new Error('User already exists');
    }
    const hasedPassword = await bcrypt.hash(password,10);
    const user = await User.create({username,email,password: hasedPassword});
    if(user){
        res.status(201).json({_id:user._id,username:user.username,email:user.email});
    }else{
        res.status(400).json({message:"Something went wrong"});
    }
})

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
         res.status(400);
         throw new Error('All fields are required');
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "60m"}
        );
        res.status(200).json({accessToken});
    }
    else{
        res.status(401);
        throw new Error('Email or password is incorrect');
    }
    
})

//@desc Get current user
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.status(200).json({'user':req.user});
})

module.exports = {registerUser,loginUser,currentUser}