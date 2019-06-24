const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    // Fetch username from req and then get posts from db and pass its array to dashboard ejs
    res.render('dashboard',{
        user: req.user
      })
})

module.exports=router;