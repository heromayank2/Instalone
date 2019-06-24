const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5000;

// EJS
app.use(expressLayouts)
app.set('view engine','ejs')

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/',(req,res)=>{
    res.send("Hello World")
})
app.use('/',require('./routes/user'));

app.listen(PORT,console.log("Listening on PORT "+PORT));