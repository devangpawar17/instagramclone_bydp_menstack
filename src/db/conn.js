const mongoose = require("mongoose")

mongoose.connect(process.env.dburi,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify: false
})
.then(()=>{
    console.log("db connected");
}).catch((e)=>{
    console.log("db not connected");
})