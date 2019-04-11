const Graph=require('../models/graph');

const fs=require('fs');
const busboy=require('body-parser');

exports.getGraph=function(req,res,next){
    // Graph.findOne(_id: req.params.id).then()
    console.log("Rien");
}

exports.postGraph=function(req,res,next){
    /* const graph= new Graph({

    }); */
    console.log(req.body);
}

