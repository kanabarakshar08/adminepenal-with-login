const categary = require("../models/categary");
const path = require("path");

//add categary form formet
module.exports.addcategary = async(req,res)=>{
    res.render("add_categary")
}
//insert cateary record
module.exports.insertcategary = async(req,res)=>{
    // console.log(req.body);
    req.body.IsActive = true;
    req.body.Create_Date = new Date().toLocaleString();
    req.body.Upadate_Date = new Date().toLocaleString();
    let categarydata = await categary.create(req.body);
    if(categarydata){
        return res.redirect('back');
    }
    console.log("data not insert");
}
//view categary data in table formt
module.exports.view_categary = async(req,res)=>{
    let search = '';
    if(req.query.search){
        search= req.query.search
    }

    if(req.query.page){
        page = req.query.page;
    }
    else{
        page = 0
    }
    var perpage = 2;

    let categarydata = await categary.find({
        "categary_name":{$regex:".*"+search+".*", $options:"i"}
    })  .limit(perpage)
    .skip(perpage*page);
     const categarypage = await categary.find({
        "categary_name":{$regex:".*"+search+".*", $options:"i"}
     }).countDocuments();

    if(categarydata){
        var cr = req.user;
        res.render("view_categary",{
            'viewcategary':categarydata,
            'categaryreco':cr,
            'search': search,
            totalDocument : Math.ceil(categarypage/perpage),
            curentpage :page
        }) 

    }
    else{
        console.log('somthing went worng');
        return res.render('view_post');
    }
}
//isactve and isdeactive categary data is start
module.exports.isactive = async(req,res)=>{
    try{
        if(req.params.id){
            let active = await categary.findByIdAndUpdate(req.params.id,{IsActive:false})
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
            let active = await categary.findByIdAndUpdate(req.params.id,{IsActive:true})
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
//isactve and isdeactive categary data is end
//delete categary data start
module.exports.delterecrod = async(req,res)=>{
    console.log(req.params.id)
    try{       
        let DeleteRecord =await categary.findByIdAndDelete(req.params.id);
        if(DeleteRecord){
            console.log("Record and Image Delete Succesfully");
            res.redirect('back');
        }
        else{
            console.log("Record Delete Succesfully");
            res.redirect('back');
        }
    }
    catch(err){
        console.log("data is not delete"+err);
        return res.redirect('back')
    }
}
//delete categary data end
//update categary recrd start
module.exports.updaterecord = async(req,res)=>{
    try{
        
        let categarydata = await categary.findById(req.params.id);
        var cr = req.user;
        if(categarydata){
            return res.render('update_categary',{
               
                'viewcategary':categarydata,
                'categaryreco':cr
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

module.exports.editecategarydata = async(req,res)=>{
   try{
    
    if(req.file){
        let oldData = await categary.findById(req.body.EditId);
        if(oldData){
            console.log(oldData);
            if(oldData){
                let FullPath = path.join(__dirname,"..",oldData);
                await fs.unlinkSync(FullPath);
            }
            let ad  = await categary.findByIdAndUpdate(req.body.EditId,req.body);
            if(ad){
                console.log("Record & Image Update Succesfully")
                return res.redirect('/admine/categary/view_categary');
            }
            else{
                console.log("Record Not Updated");
                return res.redirect('/admine/categary/view_categary');
            }
        }
        else{
            console.log("Record Not Updated");
            return res.redirect('/admine/categary/view_categary');
        } 
    }
    else{
        let oldData = await categary.findById(req.body.EditId);
        if(oldData){
            req.body.categary_name= req.body.categary_name;
            let ad  = await categary.findByIdAndUpdate(req.body.EditId,req.body);
            if(ad){
                console.log("Record Update Succesfully")
                return res.redirect('/admine/categary/view_categary');
            }
            else{
                console.log("Record Not Updated");
                return res.redirect('/admine/categary/view_categary');
            }
        }
        else{
            console.log("Record Not Updated");
            return res.redirect('/admine/categary/view_categary');
        }
    }
   }
   catch(err){
     console.log(err);
     return res.redirect('/admine/categary/view_categary');
   }

}
//update categary record end
//multple delet
module.exports.multepleselce = async(req,res)=>{
    await categary.deleteMany({_id : {$in : req.body.deletechackbox}})
    return res.redirect('back')
}