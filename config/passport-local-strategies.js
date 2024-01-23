const passport = require('passport');
const passportLocal = require('passport-local').Strategy;

const admin = require('../models/Admine');

passport.use(new passportLocal({
    usernameField : 'email'
},async (email,password,done)=>{
    let adminData = await admin.findOne({email:email});
    console.log(email,password)
    if(adminData){
        if(password == adminData.password){
            return done(null,adminData)
        }
        else{
            return done(null,false);
        }
        
    }
    else{
        return done(null,false)
    }

}))
passport.serializeUser((user,done)=>{
    return done(null,user.id);
})
passport.deserializeUser(async(id,done)=>{
    let adminrecord = await admin.findById(id);
    if(adminrecord){
        return done(null,adminrecord)
    }
    else{
        return done(null,false);
    }
})
passport.setAutho = (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user = req.user
    }
    next();
}
passport.chackAutho = (req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/admine/')
    }
}
module.exports = passport;