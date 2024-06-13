import express from "express";

const app = express();

let port = 3000;
app.listen(port, () => {
    console.log("express on port 3000!");
});