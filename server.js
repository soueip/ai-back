console.clear();
const express= require("express");
const connectDB=require("./config/dbConnect");
const app=express();

const cors=require("cors");
require("dotenv").config();
// conect to database
connectDB();

// routes
app.use(express.json());
app.use(cors());
app.use("/user",require("./routes/user"));



// server
const PORT=process.env.PORT;
app.listen(PORT,(err)=>
err?console.log(err):console.log("server is running on port ",PORT));
