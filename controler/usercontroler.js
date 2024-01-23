const path = require("path")
const slider =require("../models/slider");
const post = require("../models/post");
const Comment  =require("../models/coment");

module.exports.home = async(req,res)=>{
    // console.log("hii");
    let sliderRecord = await slider.find({IsActive:true});
    let PostRecord = await post.find({IsActive:true});
    return res.render('userpanel/home',{
        'sliderdata':sliderRecord,
        'postdata': PostRecord
    });
}
module.exports.viewblog = async(req,res)=>{
    //nex and pre post logic
    const allpostdata = await post.find({});
    var ids=[];
    allpostdata.map((v,i)=>{
        ids.push(v.id);
    })
    var next;
    for(var i=0 ; i < ids.length ; i++){
        if(ids[i]===req.params.id){
            next=i;
            break;
        }
    }
    

   
    const blogdata = await post.findById(req.params.id);
    const Comments = await Comment.find({PostId:req.params.id});
  

    return res.render("userpanel/single_bloge",{
        'blogrecord':blogdata,
        'PostId':req.params.id,
        'viewcomnet':Comments,
        'tComments':Comments.length,
        'allids':ids,
        'cp':next
    });
}
module.exports.addcoments = async(req,res)=>{
    let imgpath = '';
    if(req.file){
        imgpath = Comment.comentimagepath+"/"+req.file.filename;
    }
    
    req.body.comentImage = imgpath;
    req.body.IsActive = true;
    // req.body.name = req.user.name;
    req.body.Create_Date = new Date().toLocaleString();
    req.body.Upadate_Date = new Date().toLocaleString();
    let postdata = await Comment.create(req.body);
    return res.redirect('back');
}

