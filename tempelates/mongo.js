const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/AuthTut")
.then(() => {
    console.log("MONGO CONNECTED")
})
.catch(() => {
    console.log("ERROR")
})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        
    },
    email:{
        type:String,
        
    },
    password:{
        type: String,
       
    },
    token:{
        type: String,
       
    },
})

const User = new mongoose.model("User",userSchema)
module.exports = User