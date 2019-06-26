const express = require("express");
const router = express.Router();
const { forwardAuthenticated } = require('../config/auth');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', (req, res) => {
    const { name, email, phone, password, password2 } = req.body;
  
    if (!name || !phone || !email || !password || !password2) {
        console.log("Please enter all fields")
        res.render("register")
    }
  
    if (password != password2) {
        console.log("Passwords dont match")    
        res.render("register")
    }
  
    if (password.length < 6) {
     console.log("Password must be at least 6 characters");
     res.render("register")
    }

      User.findOne({ email: email }).then(user => {
        if (user) {
         console.log("Email Already Exists")
          res.render('register');
        } else {
          const newUser = new User({
            name,
            email,
            phone,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                    console.log("You are now Registered!")
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  );
  

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  });

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/getname',(req,res)=>{
    const {userid} = req.body;
    User.findById({'_id':userid}).then((user)=>{
        res.send(user.name)
    })
})

module.exports = router;