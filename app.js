const express=require('express');
const body_parser=require('body-parser');

const mongoose=require('mongoose');

const app=express();

const routeFunc=require("./routes/routes");

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(body_parser.json());

app.use("/graphs",routeFunc);
module.exports=app;