const mongoose = require('mongoose')

const tododb = new mongoose.Schema({
    userid:{
        type:String,
        
    },
    title:{
        type:String,
        required:true,
        
    },
    desc:{
        type:String,
        required:true
    }
    
})

const todoschema = new mongoose.model("todo",tododb);
module.exports=todoschema;
