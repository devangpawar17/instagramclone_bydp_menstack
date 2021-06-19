const mongoose = require('mongoose')

const comment = new mongoose.Schema({
  comment:{
      type:String,
      required:true
  },
  username:{
      type:String,
      required:true
  },
  userid:{
      type:String,
      required:true
  },
  postid:{
      type:String,
      required:true
  }
    
})

const commentschema = new mongoose.model("comment",comment);
module.exports=commentschema;
