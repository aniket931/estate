import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch((err) => {
        console.log("Error in mongo connection");
    });


let port = 3000;
app.listen(port, () => {
    console.log("express on port 3000!");
});