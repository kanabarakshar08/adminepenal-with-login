const express = require('express');
const port = 8091;
const app = express();
const path = require('path');
// const db = require('./config/mongoose');
const mongoose = require('mongoose');
mongoose.connect(("mongodb+srv://kanabarakshar08:AKSHAR@akshar.7qjb0c5.mongodb.net/Login"), {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategies');
const googlestargy = require("./config/google-autho");
const session = require('express-session');
const google = require("passport-google-oauth20");

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(express.urlencoded());


app.use(session({
    name : "Akshar",
    secret:"ak",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*100
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAutho);

app.use('/admine',require('./routes/admine'));

app.listen(port,(err)=>{
    if(err)
    console.log(err);
    console.log("servedr runing in port",port);
})
