const express=require('express');
const body_parser=require('body-parser');

const mongoose=require('mongoose');

const app=express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(body_parser.json());

app.use(function(req,res,next){
    console.log('Server is running...');
    next();
});
app.get('/graphs',function(req, res,next) {
    console.log('Output posted in a different route!!!');
    res.status(401).json({
        Hello: 'Hello World',
        message: 'You are in graphs now'
    }).end();
    
});

app.post('/graphs',function(req,res,next) {
    res.status(201).json({
        data: req.body
    });
    next();
    console.log("Data posted");
});

module.exports=app;