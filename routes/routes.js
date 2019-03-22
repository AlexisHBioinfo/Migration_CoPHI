const express=require('express');

const router=express.Router();

const Graph=require('../models/graph');

const contro=require('../controllers/functions');

router.get("/",[],contro.getGraph);
router.post("/:id",[],contro.postGraph);

module.exports=router;
