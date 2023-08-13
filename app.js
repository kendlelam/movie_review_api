require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.dbURL);
}

const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const reviewsRouter = require("./routes/reviews");
const moviesRouter = require("./routes/movies");
const userRouter = require("./routes/users");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE');
    }
    next();
})
app.use("/api/reviews", reviewsRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/users", userRouter);



app.listen(3000, ()=>{
    console.log("Listening on port 3000");
})

