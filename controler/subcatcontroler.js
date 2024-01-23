const Subcategary = require("../models/subcategary");
const categary = require("../models/categary");

//view subcategary page
module.exports.add_Subcategary = async(req,res)=>{
    const catgarydata = await categary.find({})
    return res.render("add_Subcategary",{
        'catdata':catgarydata
    });
}
//insert subcategary data 
module.exports.insertSubcategary = async(req,res)=>{
    try{
        let imgpath = '';
        if(req.file){
            imgpath = Subcategary.subcatimgpath+"/"+req.file.filename;
        }
        req.body.Subcaterimage = imgpath;
        req.body.IsActive = true;
        req.body.Create_Date = new Date().toLocaleString();
        req.body.Upadate_Date = new Date().toLocaleString();
        let AdminDatas = await Subcategary.create(req.body);
        return res.redirect('back');
    }
    catch(err){ 
        console.log(err);
        return res.redirect('back');
    }
}
//view subcategary data page
module.exports.view_subcategary = async(req,res)=>{

    let subcat = await Subcategary.find({}).populate('categary').exec();
    if(subcat){
        let sure = req.user
        return res.render("view_subcategary",{
            'subcatdata':subcat,
            'su':sure
        });
    }
    
}

