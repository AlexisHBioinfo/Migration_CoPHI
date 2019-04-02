const express=require('express');

const router=express.Router();

const Graph=require('../models/graph');

const contro=require('../controllers/functions');

router.get("/",contro.getGraph);
router.post("/graphs",contro.postGraph);

module.exports=router;
