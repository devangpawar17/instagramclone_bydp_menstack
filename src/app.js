require('dotenv').config()
const express = require("express");
const path = require("path");
const multer = require("multer")
var session = require("express-session");
const bcrypt = require("bcryptjs");
const hbs = require("hbs");
const port = process.env.PORT || 3000;

require("./db/conn");
// const todoschema = require("./models/todo");
const registerSchema = require("./models/register");
const postSchema = require('./models/posts')
const commentSchema = require('./models/comment')

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "ok",
    resave: false,
    saveUninitialized: true,
  })
);


const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
const viewsPath = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

var Storage = multer.diskStorage({
  destination:"./public/posts_img",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
  }
})

var upload = multer({
  storage : Storage
}).single('file')


app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partials_path);

app.get('/',async (req,res)=>{
  
  try{
    const posts_data = await postSchema.find()
    const commentdata = await commentSchema.find()
    res.render('index',{posts_data,commentdata})
  }catch(e){
    res.send(e)
  }
})

app.get('/singlepost',async (req,res)=>{
  if (req.session.userName) {
  try{
    const pid = req.query.id
    const caption = await postSchema.findById(pid)
    const cmntpost = await commentSchema.find({postid:pid})
    res.render('singlepost',{cmntpost,caption})
  }
  catch(e){
    res.send(e)
  }
  }
  else{
    res.redirect('/register')
  }

})

app.post('/',async (req,res)=>{
  const comment = req.body.comment
  const postid= req.body.postid
  const username = req.session.userName
  try{
    const commentdb = commentSchema({
      comment:comment,
      username:username,
      userid:req.session.userId,
      postid:postid
    })
    await commentdb.save()
  res.redirect('/singlepost?id='+postid)
  }catch(e){
    res.render('register')
  }
})
app.get('/register',(req,res)=>{
  res.render('register')
})
app.get('/login',(req,res)=>{
  res.render('login')
})
app.get('/profile',async (req,res)=>{
  if (req.session.userName) {
  try {
    const userid =  req.session.userId
    const username = req.session.userName
    const bio = req.session.bio
    const postsdata = await postSchema.find( { userid: userid });
    res.render("profile", { username,bio,postsdata});
  } catch (e) {
    console.log(e);
  }
  }
  else{
    res.redirect('/register')
  }

})
app.get('/addposts',(req,res)=>{
  if (req.session.userName) {
  res.render('addposts')
  }
  else{
    res.render('register')
  }
})
app.post('/addposts',upload,async (req,res)=>{
  var fileName = req.file.filename
  var user_id = req.session.userId
  try{
    const newpost = postSchema({
      filename: fileName,
      caption: req.body.caption,
      userid : user_id,
      username:req.session.userName
    })
    await newpost.save()
    res.redirect('/')
  }catch(e){
    res.send(e)
  }
})

app.post('/register',async (req,res)=>{
  try {
    const newuser = new registerSchema({
      mobile_number:req.body.num,
      bio :req.body.bio,
      username: req.body.username,
      password: req.body.password
    });

    const newUser = await newuser.save();
    res.redirect("/login");
  } catch (e) {
    res.send("error" + e);
  }
})
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const dbname = await registerSchema.findOne({ username: username });
    const userid = dbname._id

    const ismatch = await bcrypt.compare(password, dbname.password);
    if (ismatch) {
      var hour = 3600000
      req.session.cookie.expires = new Date(Date.now() + hour)
      req.session.cookie.maxAge = hour
      req.session.userName = username;
      req.session.bio = dbname.bio
      req.session.userId = userid
      res.status(201);
      res.redirect("/profile");
    } else {
      res.send("wrong credentials");
    }
  } catch (e) {
    console.log(e);
    res.send('wrong credentials')
  }
});



app.listen(port),
  () => {
    console.log("server running");
  };
