const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

const Movie = require("../models/movie")


router.get("/", asyncHandler(async (req, res)=> {
    const allMovies= await Movie.find({}, "title year");
    res.json({
        allMovies,
    })
}));

router.get("/:movieId", async (req, res)=> {
    try{
        const thisMovie = await Review.findById(req.params.movieId);
        if (thisMovie) {
            res.json({
                message:`Received GET for ${req.params.movieId} review!`,
                movie: thisMovie,
            })
        } else {
            res.json({
                message:"No movie found."
            })
        }
        
    } catch (error) {
        res.status(404).json({
            message:"Movie search failed.",
            error: error.message
         })
    }
    
    
});


router.post("/", asyncHandler(async (req, res)=> {
    const movie = new Movie({
        title:req.body.title,
        director:req.body.director,
        starring:req.body.starring,
        year:req.body.year
    })
    await movie.save();

    res.json({
        movie
    })

}))

router.patch("/:movieId",asyncHandler(async(req, res)=> {

    
}));

router.delete("/:movieId", asyncHandler(async (req, res)=> {

    
}));


module.exports = router;