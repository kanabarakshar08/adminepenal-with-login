const admin = require('../models/Admine');
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer")
const { Module } = require('module');
const { match } = require('assert');
const { query } = require('express');

module.exports.dashbord = async (req,res)=>{ 
  
    return res.render("dashbord")
}
module.exports.login = async(req,res)=>{
    if(req.user){
        return res.redirect('/dashbord')
    }
    return res.render('login');
    
}
module.exports.add_admine = async(req,res)=>{
    if(req.user == undefined){
        return res.redirect('/admine/dashbord')
    }
    var adminrecord = req.user;
    return res.render('add_admine',{
        record : adminrecord
    });
}
module.exports.view_admine = async(req,res)=>{
    // console.log(req.file);
    // console.log(req.body)
    let search = '';
    if(req.query.search){
        search= req.query.search
    }
    // console.log(req.query.search);
    if(req.query.page){
        page = req.query.page;
    }
    else{
        page = 0
    }
    var perpage = 2;


    let admindata = await admin.find({
        $or :[
            {"name":{$regex:".*"+search+".*", $options:"i"}},
            {"email":{$regex:".*"+search+".*" , $options:"i"}},
            {"gender":{$regex:".*"+search+".*", $options:"i"}}
        ]
    })
    .limit(perpage)
    .skip(perpage*page);

    let AdminePage = await admin.find({
        $or :[
            {"name":{$regex:".*"+search+".*", $options:"i"}},
            {"email":{$regex:".*"+search+".*" , $options:"i"}},
            {"gender":{$regex:".*"+search+".*", $options:"i"}}
        ]
    }).countDocuments();
    // console.log(AdminePage);

    if(admindata){
        var adminrecord = req.user;
        return res.render('view_admine',{
            admines : admindata,
            record : adminrecord,
            search: search,
            totalDocument : Math.ceil(AdminePage/perpage),
            curentpage :page
        })
    }
    else{
        console.log('somthing went worng');
        return res.render('view_admine');
    }
}
// add data prosecce is start

module.exports.insertadmindata = async(req,res)=>{
    // console.log(req.file);
    // console.log(req.body);
    if(req.user== undefined){
        return res.redirect('/admine/')
    }
    try{
        var adminimgpath = '';
        req.body.name = req.body.fname+" "+req.body.lname;
        if(req.file){
            adminimgpath =  admin.Adminimagepath+"/"+req.file.filename;
        }
        req.body.Admineimage = adminimgpath;
        req.body.IsActive = true;
        req.body.Create_Date = new Date().toLocaleString();
        req.body.Upadate_Date = new Date().toLocaleString();
        let AdminDatas = await admin.create(req.body);
        
        if(AdminDatas){
            console.log("insert data is successfully");
           
            return res.redirect('/admine/view_admine');
        }
        else{
            console.log("somthing went worng");
            return res.redirect('back');
        }
        }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
// add data prosecce is end  

module.exports.isactive = async(req,res)=>{
    try{
        if(req.params.id){
            let active = await admin.findByIdAndUpdate(req.params.id,{IsActive:false})
            if(active){
                console.log("data is deactive Successfully");
                return res.redirect('back');
            }
            else{
                console.log("record is not deactivate");
                return res.redirect('back');
            }
        }
        else{
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
module.exports.isdeactive = async(req,res)=>{
    try{
        if(req.params.id){
            let active = await admin.findByIdAndUpdate(req.params.id,{IsActive:true})
            if(active){
                console.log("data is active Successfully");
                return res.redirect('back');
            }
            else{
                console.log("record is not activate");
                return res.redirect('back');
            }
        }
        else{
            console.log("Params Id not Found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
module.exports.delterecrod = async(req,res)=>{
    // console.log(req.params.id)
    try{
        let oldData = await admin.findById(req.params.id);
        if(oldData){
            var oldImage = oldData.Admineimage;
            if(oldImage){
                let FullPath = path.join(__dirname,"..",oldData.Admineimage);
                await fs.unlinkSync(FullPath);
                let DeleteRecord =await admin.findByIdAndDelete(req.params.id);
                if(DeleteRecord){
                    console.log("Record and Image Delete Succesfully");
                    res.redirect('back');
                }
                else{
                    console.log("Record Delete Succesfully");
                    res.redirect('back');
                }
            }
            else{
                let DeleteRecord =await admin.findByIdAndDelete(req.params.id);
                if(deletPostData){
                    console.log("Admin Data Delet");
                    res.redirect('back');
                }
                else{
                    console.log("Admin Data Delet");
                    res.redirect('back');
                }
            }
        }
        else{
            console.log("Record Not Found");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back')
    }
}
module.exports.updaterecord = async(req,res)=>{
    try{
        let adminRecord = await admin.findById(req.params.id);
        var adminrecord = req.user;
        if(adminRecord){
            return res.render('update_admin',{
                admindata: adminRecord,
                record : adminrecord,
            })
        }
        else{
            console.log('Record Not Found');
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }

}

module.exports.editeadmindata = async(req,res)=>{
   try{
    
    if(req.file){
        let oldData = await admin.findById(req.body.EditId);
        if(oldData){
            console.log(oldData);
            if(oldData.Admineimage){
                let FullPath = path.join(__dirname,"..",oldData.Admineimage);
                await fs.unlinkSync(FullPath);
            }
            var adminimgpath =  admin.Adminimagepath+"/"+req.file.filename;
            req.body.Admineimage = adminimgpath;
      
            let ad  = await admin.findByIdAndUpdate(req.body.EditId,req.body);
            if(ad){
                console.log("Record & Image Update Succesfully")
                return res.redirect('/admine/view_admine');
            }
            else{
                console.log("Record Not Updated");
                return res.redirect('/admine/view_admine');
            }
        }
        else{
            console.log("Record Not Updated");
            return res.redirect('/admine/view_admine');
        } 
    }
    else{
        let oldData = await admin.findById(req.body.EditId);
        if(oldData){
           
            
            req.body.Admineimage = oldData.Admineimage;
            
            req.body.name= req.body.fname;
            let ad  = await admin.findByIdAndUpdate(req.body.EditId,req.body);
            if(ad){
                console.log("Record Update Succesfully")
                return res.redirect('/admine/view_admine');
            }
            else{
                console.log("Record Not Updated");
                return res.redirect('/admine/view_admine');
            }
        }
        else{
            console.log("Record Not Updated");
            return res.redirect('/admine/view_admine');
        }
    }
   }
   catch(err){
     console.log(err);
     return res.redirect('/admine/view_admine');
   }

}
module.exports.chacklogin = async (req,res)=>{
    
    return res.redirect('/admine/dashbord')
}
// update password prosess is start
module.exports.updatpasword = async(req,res)=>{
    try{
        return res.render("updatePassword",{
            record : req.user
        });

    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.Editpasword = async(req,res)=>{
   try{
    var adminrecord = req.user;
    if(adminrecord.password == req.body.cpass){
        if(req.body.cpass != req.body.npass){
            if(req.body.npass == req.body.copass){
                let alladmin = await admin.findById(adminrecord._id);
                if(alladmin){
                    let editpass = await admin.findByIdAndUpdate(alladmin.id,{'password':req.body.npass});
                    if(editpass){
                        return res.redirect("/admine/logout");
                    }
                    else{
                        console.log("password is not Updated");
                    }
                }
                else{
                    console.log("record is not found")
                }
            }
            else{
                console.log("new password and Conform password is not match")
            }

        }
        else{
            console.log("curent password and new password is same please enter difrent password")
        }
    }
    else{
        console.log("curent password and old password is not match")
    }
}
catch(err){
    console.log(err);
    return res.redirect('back');
}
return res.redirect('back');

}
// profile detils start
module.exports.profile =  async(req,res)=>{
 try{
    let admindata = await admin.find({});
    if(admindata){
        var adminrecord = req.user;
        return res.render('profile',{
            admines : admindata,
            record : adminrecord
        })
    }
    else{
        console.log('somthing went worng');
        return res.render('profile');
    }
 }
 catch(err){
    console.log(err);
    return res.redirect('back');
 }
}
//profile detils end
// profile update start
module.exports.updateprofile = async(req,res)=>{
    try{
        if(req.user == undefined)
        {
            return res.redirect("/admine")
        }
        return res.render("editprofile",{
            record : req.user
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.backprofile = async(req,res)=>{
    var adminrecord = req.user;
    return res.render("profile",{
        record : adminrecord
    })
}
// profile update end
//forget password module start
module.exports.chackemail = async(req,res)=>{
    // console.log(req.body)
    try{
        let chackemailData = await admin.findOne({email:req.body.email})
        if(chackemailData){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "kanabarakshar08@gmail.com",
                    pass: "mwxgfgzopzadnjpo",
                },
            });

            const otp = Math.floor(Math.random()*5000)+4999;
            res.cookie('otp',otp);
            res.cookie('email',chackemailData.email);
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'kanabarakshar08@gmail.com', // sender address
            to: req.body.email, // list of receivers
            subject: "otp", // Subject line
            text: "otp is hear", // plain text body
            html: `<b>your otp is ${otp}</b>`, // html body
        });
        if(info){
            return res.redirect('/admine/otppage')
        }
        else{
            console.log("somthing went wrongs");
            return res.redirect('back')
        }
        // console.log("email is valid");

    }
    else{
        console.log("email is not match pleace enter valid email id");
        return res.redirect('back')
    }
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}


module.exports.chackotp = async(req,res)=>{
   try{
    //    console.log(req.body) //this otp use for user in email
    //    console.log(req.cookies) // this otp use for devlopers in cookies or browser
     let  fotp =  req.body.otp.join([]);
    if( fotp == req.cookies.otp){
        return res.redirect('/admine/creatpass')
    }
    else{
        console.log("can't match otp");
        return res.redirect('back')
    }
   }
   catch(err){
        console.log(err);
        return res.redirect('back')
   }
}
module.exports.varfypass = async(req,res)=>{
    // console.log(req.body);
    if(req.body.npass==req.body.cpass){
        // res.cookie('email',email);
        let email = req.cookies.email;
        let chackemailrecord = await admin.findOne({email:email});
        if(chackemailrecord){
            let resetpass = await admin.findByIdAndUpdate(chackemailrecord.id,{'password':req.body.npass});
            if(resetpass){
                res.clearCookie('otp');
                res.clearCookie('email');
                return res.redirect('/admine/')
            }
            else{
                console.log("password is not change!!");
                return res.redirect('back')
            }
        }
        else{
            console.log("email recrd is not found!!");
            return  res.redirect('back')
        }
    }
    else{
        console.log("new password and conform password is not match");
        return res.redirect('back');
    }
}
//forget password module end
module.exports.multepleselce = async(req,res)=>{
    console.log(req.body);
    await admin.deleteMany({_id : {$in : req.body.deletechackbox}})
    return res.redirect('back')
}