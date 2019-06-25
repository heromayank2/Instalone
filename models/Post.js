const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  userid: {
    type: String
  },
  image: {
    data: Buffer,
    contentType: String
  },
  caption: {
    type: String,
    required: true
  },
  likes: {
    type: Array
  },
  comments: {
    type: Array
  }
});

//Export the model
module.exports = mongoose.model("Post", postSchema);
