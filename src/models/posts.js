const mongoose = require('mongoose')

const posts = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    caption:{
        type:String,      
    },
    userid:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    }
    
})

const postschema = new mongoose.model("post",posts);
module.exports=postschema;
