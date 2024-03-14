const express = require('express')
const Collection = require('./tempelates/mongo')


const app = express()

const path = require('path')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bcryptjs = require('bcryptjs')

app.use(express.json())
app.use(cookieParser())
// app.use(bcryptjs)
app.use(express.urlencoded({extended : false}))

const templatePath =  path.join(__dirname,"./tempelates")
const publicPath = path.join(__dirname,"./public")

// app.set("view engine","hbs")
app.set("view engine","ejs")
app.set("views",templatePath)
app.use(express.static(publicPath))


async function hashPass(password){
    const res = await bcryptjs.hash(password,10)
    return res
}

async function compare(userPass , hashPass){
    const res = await bcryptjs.compare(userPass,hashPass)
    return res
}


app.get("/",(req,res) => {

    if(req.cookies.jwt){
        const verify = jwt.verify(req.cookies.jwt,"jdbfhdsbvbdskjhvdfbvmhdsiuhmdsnvldsjkvdbjvhkdsbvdsnlvihdsvbjkkdbsmvbmdsbkjhdskbvmbdsmbhuhfyvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkvjhdskbvmbdsjkvhuidsk")
        res.render("home",{name:verify.name})
    }
    else{
        res.render("index")
    }
})

app.get("/signup",(req,res) => {
    res.render("signup")
})

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/signup",async (req,res) => {
    try {
        const check = await Collection.findOne({name:req.body.name})
        console.log("hlo")
        
        if(check){
            res.send("USER ALREADY EXISTS")
        }
        else{
            const token = jwt.sign({name:req.body.name},"jdbfhdsbvbdskjhvdfbvmhdsiuhmdsnvldsjkvdbjvhkdsbvdsnlvihdsvbjkkdbsmvbmdsbkjhdskbvmbdsmbhuhfyvhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkvjhdskbvmbdsjkvhuidsk")
            
            // res.cookie("jwt",token,{
            //     maxAge:600000,
            //     httpOnly:true
            // })

            const data = {
                name: req.body.name,
                password: await hashPass(req.body.password),
                token: token,
            }

            await Collection.insertMany([data])
            res.render("index")

            
        }
    } catch (error) {
        res.send("WRONG DEATILS")
        
    }
})

app.post("/login",async (req,res) => {
    console.log("hlo2")
    try {
        const check = await Collection.findOne({name:req.body.name})
        const passCheck = await compare(req.body.password , check.password)
        console.log(check)

        if(check && passCheck){

            // res.cookie("jwt",check.token,{
            //     maxAge:600000,
            //     httpOnly:true
            // })

            res.render("index",{name:req.body.name})
        }
        else{
            console.log("gh")
            res.send("Wrong details")   
        }
    }
    catch{
        res.send("wrong")
    }
})

app.listen(4000,() => {
    console.log("CONNECTED")
})