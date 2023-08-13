const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();



const User = require("../models/user")

router.post('/signup', async (req, res, next)=>{
    const matches = await User.find({username: req.body.username});
    if (matches.length > 0) {
        return res.status(422).json({
            error:"Auth failed",
        })
    }
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username:req.body.username,
            password,
        })
        await newUser.save();
        console.log(newUser);
        res.status(201).json({
            message:"User created"
        })
    } catch (err) {
        res.json({
            message:"User signup failed"
        })
    }
    
    
})

router.post('/login', async (req, res, next)=>{
    const user = await User.findOne({username: req.body.username})
    if (!user) {
        return res.status(404).json({
            err:"Auth failed"
        })
    }
    const correctPass = await bcrypt.compare(req.body.password, user.password);
    if (correctPass) {
        const token = jwt.sign({username:user.username, sub:user._id}, process.env.JWT_KEY
            ,{expiresIn: "1h"});
        return res.json({
            message:"Auth success",
            token,
        })
    }
    res.status(404).json({
        err:"Auth failed"
    })
})


router.delete('/:userId', async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (user) {
        res.json({
            message:`Received Delete for user`,
            deletedObject: user
        })
    } else {
        res.json({
            message:`Object to delete not found`
        })
    }
})



module.exports = router;