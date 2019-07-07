const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Post = require("../models/Post");
const User = require("../models/User");



module.exports = router;