const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
const User = require("../models/User");
var fs = require("fs");
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  // Ideal is the '_id' of user to whom i follow
  //   const ideals = req.user.ideals;
  // const posts = [];
  //   ideals.forEach(function(ideal) {
  //     Post.find({ userid: ideal }).then((post)=>console.log(post));
  //   });
  Post.find({}).then(posts => {
    res.render("dashboard", {
      user: req.user,
      posts
    });
  });
});
router.get("/profile/:userid", ensureAuthenticated, (req, res) => {
  var userissame = 0;
  if (req.params.userid == req.user._id) {
    userissame = 1;
  }
  Post.findOne({ userid: req.params.userid }).then(posts => {
    console.log("Here are the posts");
    console.log(posts);
    if (!userissame) {
      User.findById({ _id: req.params.userid }).then(user => {
        console.log("Here is the User ");
        console.log(user);
        var alreadyfollowing = false;
        if(req.user.ideals.includes(req.params.userid)==true){
          alreadyfollowing = true;
        }
        res.render("profile", { user ,userissame, posts,alreadyfollowing});
        
      });
    } else {
      res.render("profile", {user:req.user,userissame,posts});
    }
  });
  
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

router.get("/post/like/", (req, res) => {
  // const { postid } = req.body;
  const _id = "5d11a4bd67ad8a10ec452f6c";
  const userid = req.user._id;

  Post.findById({ _id: _id }).then(post => {
    var post = post;
    post.likes.push(userid);
    console.log(post);
    Post.findByIdAndUpdate({ _id: _id }, post, { new: true }, (err, post) => {
      if (err) {
        console.log("Something wrong when liking the post!");
      }
      console.log(post);
      User.findById({ _id: userid }).then(user => {
        var user = user;
        user.likes.push(_id);
        User.findByIdAndUpdate(
          { _id: userid },
          user,
          { new: true },
          (err, user) => {
            if (err) {
              console.log(err);
            }
          }
        );
      });
      res.redirect("/dashboard");
    });
  });
});

router.post("/post/comment/:postid", (req, res) => {
  console.log(req.params.postid);
  console.log(req.user._id);
  console.log(req.body.comment);
  var _id = req.params.postid;
  var userid = req.user._id;
  var comment = req.body.comment;
  Post.findById({ _id: _id }).then(post => {
    var post = post;
    post.comments.push({ userid: userid, comment: comment });
    Post.findByIdAndUpdate({ _id: _id }, post, { new: true }, (err, post) => {
      if (err) {
        console.log("Something wrong when liking the post!");
      }
      console.log(post);
      res.redirect("/dashboard");
    });
  });
});

router.post("/post/delete", (req, res) => {});

router.get("/post/liked", (req, res) => {
  var likedPostsId = req.user.likes;
  var posts = [];
  likedPostsId.forEach(function(postid) {
    Post.findById({ _id: postid }).then(post => {
      console.log(post);
      posts.push(post);
    });
  });
  console.log(posts);
  res.render("liked", { posts });
});

router.get('/follow/:userid',(req,res)=>{
  User.findById({_id:req.user._id}).then(user=>{
    var newuser = user;
    newuser.ideals.push(req.params.userid);
    User.findByIdAndUpdate({_id:req.user._id},newuser,{ new: true }, (err, user) => {
      if (err) {
        console.log("Something wrong when following the user!");
      }
      User.findById({_id:req.params.userid}).then(user=>{
        var newuser2= user;
        newuser2.followers.push(req.user._id);
        User.findByIdAndUpdate({_id:req.params.userid},newuser2,{ new:true},(err,user)=>{
          if(err){
            console.log("Something Wrong Happened");
          }
          res.redirect("/profile/"+req.params.userid);
        })
      })
    });
  })  
})

router.get('/unfollow/:userid',(req,res)=>{
  User.findById({_id:req.user._id}).then(user=>{
    var newuser = user;
    var index = newuser.ideals.indexOf(req.params.userid);
    if (index > -1) {
      newuser.ideals.splice(index, 1);
    }
    User.findByIdAndUpdate({_id:req.user._id},newuser,{ new: true }, (err, user) => {
      if (err) {
        console.log("Something wrong when following the user!");
      }
      // 
      User.findById({_id:req.params.userid}).then(user=>{
        var newuser2= user;
        var secindex = newuser2.followers.indexOf(req.user._id);
        if (secindex > -1) {
          newuser2.followers.splice(secindex, 1);
        }
        User.findByIdAndUpdate({_id:req.params.userid},newuser2,{ new:true},(err,user)=>{
          if(err){
            console.log("Something Wrong Happened");
          }
          res.redirect("/profile/"+req.params.userid);
        })
      })
    });
  })  
})

router.post('/profile/search',(req,res)=>{
  const {search} = req.body;
  User.find({}).then(users=>{
    var userlist=[]
    users.forEach(function(user){
      if(user.name.toLowerCase().includes(search.toLowerCase())==true){
        userlist.push(user)
      }
    })
    res.render('list',{'type':'search','list':userlist,'user':req.user})
  })
 })

 router.get('/followers/:userid',(req,res)=>{
  var _id=req.params.userid;
  User.findById({_id:_id}).then(user=>{
      res.render('list',{
          'type': 'followers',
          'list':user.followers,
          
      }
      )
  })
})

module.exports = router;
