const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Review = require("../models/review");
const passport = require('../middleware/passport');

router.get("/", asyncHandler(async (req, res)=> {
    const allReviews = await Review.find().populate("movie","title year").populate("author");
    res.json({
        allReviews,
    })
}));

router.get("/:reviewId", async (req, res)=> {
    try{
        const thisReview = await Review.findById(req.params.reviewId).populate("author", "username");
        if (thisReview) {
            res.json({
                message:`Received GET for ${req.params.reviewId} review!`,
                review: thisReview,
            })
        } else {
            res.json({
                message:"No review found."
            })
        }
        
    } catch (error) {
        res.status(404).json({
            message:"Review search failed.",
            error: error.message
         })
    }
    
    
});

router.post("/", passport.authenticate('jwt', {session:false}),asyncHandler(async (req, res)=> {
    const review = new Review({
        author:req.user,
        movie: req.body.movie,
        title:req.body.title,
        date:req.body.date,
        rating:req.body.rating,
        text:req.body.text
    })
    await review.save();

    res.json({
        review
    })
}))

router.patch("/:reviewId",asyncHandler(async(req, res)=> {
    const allUpdates = {}
    for (const update of req.body) {
        allUpdates[update.propName] = update.value;
    }
    const review = await Review.findByIdAndUpdate(req.params.reviewId, allUpdates)
    if (review){
        res.json({
            message:"Updated review!",
            updatedReview: review
        })
    } else {
        res.json({
            message: "No matching doc found."
        })
    }
    
}));

router.delete("/:reviewId", passport.authenticate('jwt', {session:false}), asyncHandler(async (req, res)=> {
    const review = await Review.findByIdAndDelete(req.params.reviewId);
    if (review) {
        if (!review.author.equals(req.user)){
            return res.json({
                message:"Cannot delete"
            })
        } 
        res.json({
            message:`Received Delete for reviews`,
            deletedObject: review
        })
    } else {
        res.json({
            message:`Object to delete not found`
        })
    }
    
}));


module.exports = router;