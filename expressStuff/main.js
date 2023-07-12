const express = require("express");
const app = require("../server").app;

app.get("/", (req, res)=>{
    res.sendFile("index.html");
})

module.exports = app;