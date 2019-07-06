const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
const User = require("../models/User");

router.get('/followers/:userid',(req,res)=>{
    var _id=req.params.userid;
    User.findById({_id:_id}).then(user=>{
        res.render('list',{
            'type': 'followers',
            'list':user.followers
        }
        )
    })
})


module.exports = router;