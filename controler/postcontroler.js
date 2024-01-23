const post = require("../models/post")

module.exports.add_post = async(req,res)=>{
    return res.render('add_post');
}
module.exports.insertpostdata = async(req,res)=>{
    let imgpath = '';
    if(req.file){
        imgpath = post.Postimage+"/"+req.file.filename;
    }
    req.body.Post_image = imgpath;
    req.body.IsActive = true;
    req.body.username = req.user.name;
    req.body.Create_Date = new Date().toLocaleString();
    req.body.Upadate_Date = new Date().toLocaleString();
    let postdata = await post.create(req.body);
    return res.redirect('back');
}
module.exports.view_post = async(req,res)=>{
    let postdata = await post.find({});
    if(postdata){
        var pr = req.user;
        res.render("view_post",{
            'viewpostdata':postdata,
            'postreco':pr
        }) 

    }
    else{
        console.log('somthing went worng');
        return res.render('view_post');
    }
}