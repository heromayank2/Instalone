const mongoose = require('mongoose'); 

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    ideals:{
        type:Array
    },
    followers:{
        type:Array
    },
    likes:{
        type:Array
    }
});


module.exports = mongoose.model('User', userSchema);