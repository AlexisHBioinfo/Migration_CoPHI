const Graph=require('../models/graph');

exports.getGraph=function(req,res,next){
    Graph.findOne(_id: req.params.id).then()
}

exports.postGraph=function(req,res,next){
    const graph= New Graph({
        
    })
}