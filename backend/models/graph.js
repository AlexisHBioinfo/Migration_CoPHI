const mongoose=require("mongoose");

const graphSchema=mongoose.Schema({
    // Stuff to write...
    reac: {type: String, required:true},
    nombr0: {type: Number, required: true},
    nombr1: {type: Number, required: true},
    nombr2: {type: Number, required: true},

});

module.exports=mongoose.model("Graph",graphSchema);