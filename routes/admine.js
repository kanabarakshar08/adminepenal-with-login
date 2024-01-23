    const express = require('express');
const admin = require('../models/Admine')
const passport = require('passport');
const admineroutes = express.Router();

const admineControler = require('../controler/adminecontroler');
admineroutes.get('/',admineControler.login);
admineroutes.get('/dashbord',passport.chackAutho,admineControler.dashbord);
admineroutes.get('/add_admine',passport.chackAutho,admineControler.add_admine);
admineroutes.post('/insertadmindata',admin.uploadmineimage,admineControler.insertadmindata)
admineroutes.get('/view_admine',passport.chackAutho,admineControler.view_admine);
admineroutes.get("/isactive/:id",admineControler.isactive);
admineroutes.get("/isdeactive/:id",admineControler.isdeactive);
admineroutes.get("/delterecrod/:id",admineControler.delterecrod);
admineroutes.get("/updaterecord/:id",admineControler.updaterecord);
admineroutes.post('/editeadmindata',admin.uploadmineimage,admineControler.editeadmindata);
admineroutes.post('/chacklogin',passport.authenticate('local',{failureRedirect:'/admine/'}),admineControler.chacklogin);
admineroutes.get('/logout',async(req,res)=>{
   req.session.destroy((err)=>{
    if(err){
        console.log("somthing went wrong");
        return res.redirect('dashbord');
    }
    else{
        return res.redirect("/admine")
    }
   })
})
admineroutes.get("/updatePassword" , admineControler.updatpasword);
admineroutes.get('/profile',admineControler.profile)
admineroutes.post("/Editpasword",admineControler.Editpasword);
admineroutes.get('/updateprofile',admineControler.updateprofile);
admineroutes.get('/backprofile',admineControler.backprofile);
// forget password routing start 
admineroutes.get('/emailpage',async(req,res)=>{
    return res.render('forgetpass/emailpage')
})
admineroutes.post('/chackemail',admineControler.chackemail);
admineroutes.get('/otppage',async(req,res)=>{
    return res.render('forgetpass/otppage')
})
admineroutes.post('/chackotp',admineControler.chackotp);
admineroutes.get('/creatpass',async(req,res)=>{
    return res.render('forgetpass/creatpass');
})
admineroutes.post('/varfypass',admineControler.varfypass)
admineroutes.get('/chackemail',admineControler.chackemail);
admineroutes.post('/multepleselce',admineControler.multepleselce);
//login with google
admineroutes.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));
admineroutes.get('/google/callback',passport.authenticate('google', { failureRedirect: '/admine/login' }),admineControler.chacklogin);

module.exports = admineroutes;