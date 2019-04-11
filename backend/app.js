const express=require('express');
const body_parser=require('body-parser');

const mongoose=require('mongoose');

const app=express();

const routeFunc=require("./routes/routes");
/*  mongoose.connect('mongodb+srv://jumagari:lggPs182GIXVgPI6@cluster0-uznwk.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(body_parser.json());

app.use("/",routeFunc);
module.exports=app;