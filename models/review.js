const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    author: {type: mongoose.Types.ObjectId, ref:"User", required:true},
    movie: {type: mongoose.Types.ObjectId, ref:"Movie", required:true},
    date: {type:String, required:true},
    rating: {type: Number, required:true},
    title: {type: String, required:true},
    text: {type: String, required: true}

})

module.exports = mongoose.model("Review", ReviewSchema);