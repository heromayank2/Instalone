const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
var fs = require("fs");
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // Ideal is the '_id' of user to whom i follow
  //   const ideals = req.user.ideals;
    // const posts = [];
  //   ideals.forEach(function(ideal) {
  //     Post.find({ userid: ideal }).then((post)=>console.log(post));
  //   });
  Post.find({}).then((posts)=>{
    res.render("dashboard", {
      user: req.user,
      posts
    });
  })
  
});

router.post("/post/create", ensureAuthenticated, (req, res) => {
  const { caption, image } = req.body;
  console.log(image);
  var newPost = new Post();
  newPost.caption = caption;
  newPost.image.data = fs.readFileSync(image);
  newPost.image.contentType =
    "image/" + image.slice(image.length - 3, image.length);
  newPost.userid = req.user._id;
  console.log(newPost);
  newPost
    .save()
    .then(post => {
      console.log("New Post Added");
    })
    .catch(err => {
      console.log(err);
    });
  res.redirect("/dashboard");
});

router.post("/post/like", (req, res) => {});

router.post("/post/comment", (req, res) => {});

router.post("/post/delete", (req, res) => {});

router.get("/post/liked",(req,res)=>{
  var likedPostsId = req.user.likes;
  var posts=[];
  likedPostsId.forEach(function(postid){
    Post.findById({_id:postid}).then((post)=>{
      posts.push(post)
    })
  })
  console.log(posts)
  res.render('liked',{posts})
})

module.exports = router;
