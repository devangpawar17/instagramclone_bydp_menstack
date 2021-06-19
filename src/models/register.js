const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const register = new mongoose.Schema({
    mobile_number:{
        type:Number,
        min:10
    },
    bio:{
        type:String,
        max:100
    },
    username:{
        type:String,
        required:true,
        unique:true,
        max:20
    },
    password:{
        type:String,
        required:true
    }
})

register.pre("save", async function (next){
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10)
}
    next()
})

const registerSchema = new mongoose.model("register",register);
module.exports=registerSchema;