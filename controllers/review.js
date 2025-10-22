const mongoose=require('mongoose');
const {userReview}=require('../joi.js');
const {listing,review}=require('../listing');
const NewError=require('../error.js');

//Checking Id 
const isValid=(id)=>mongoose.Types.ObjectId.isValid(id);

//Get Form
module.exports.get=(req,res)=>{
    let {id}=req.params;
    res.render('rating.ejs',{id});
}

//Form Post
module.exports.post=async (req,res)=>{
    let {id}=req.params;
    if(!isValid(id)){
        throw new NewError(400,'Not Found');
    }
    let {error,value}=userReview.validate(req.body);
    if(error){
        throw new NewError(400,error);
    }
    let review1=new review(value.rating);
   let list= await listing.findById(id);
   if(!list){
    throw new NewError(404,'Invalid Id');
   }
   review1.auther=req.user.id;
     await review1.save();
   list.ratings.push(review1);
   await list.save();
    req.flash('success','Review Added!');
   res.redirect(`/listing/${id}`);
}

//Destroy
module.exports.destroy=async (req,res)=>{
    let {id,r_id}=req.params;
    await review.findByIdAndDelete(r_id);
    await listing.findByIdAndUpdate(id,{$pull:{ratings:r_id}});
     req.flash('success','Review Deleted!');
    res.redirect(`/listing/${id}`);
}
