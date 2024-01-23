const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const admin =require("../models/Admine");


passport.use(new GoogleStrategy({
    clientID: "690434170820-bhvt51ipsfm91u2lqpneng0ucohfrak5.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8091/admine/google/callback"
  },
  
  async function(accessToken, refreshToken, profile, cb) {
    // console.log(profile.emails[0].value);
    let checkemail = await admin.findOne({email:profile.emails[0].value});
    // console.log(checkemail)
        if(checkemail){
            return cb(null,checkemail)
        }
        else{
            let admindetils ={
                name:profile.displayName,
                email:profile.emails[0].value,
                password: "2345"
        }
        let adminrecord = await admin.create(admindetils)
        if(adminrecord){
            return cb(null,adminrecord)
        }
        else{
            return cb(null,false)
        }
    }
  }
));


module.exports=passport