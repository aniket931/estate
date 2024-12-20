import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";
import path from 'path';

const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser());
mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch((err) => {
        console.log("err");
    });

const __dirname = path.resolve();

let port = 3000;
app.listen(port, () => {
    console.log("express on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use(express.static(path.join(__dirname,'/client/dist')));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
