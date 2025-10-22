const isValid=(id)=>mongoose.Types.ObjectId.isValid(id);
const mongoose=require('mongoose');
const {listing,review}=require('./listing');
const NewError=require('./error.js');
const {listingSchema}=require('./joi.js');

//Save user destination before login
module.exports.userAuthenticated=(req,res,next)=>{
        req.session.saveDestination=req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash('error','You must be Logged In');
      return  res.redirect('/user/login');
    }
    next();
}
module.exports.saveDestination=(req,res,next)=>{
     req.originalUrl=req.session.saveDestination;
     next();
}

//Check Listing owner 
module.exports.ownerAuthenticated=async (req,res,next)=>{
  let id=req.params.id;
    if(!isValid(id)){
          throw new NewError(400,'Not Found');
        }
  let list=await listing.findById(id).populate('owner');
  if(list && !list.owner[0]._id.equals(req.user._id)){
     req.flash('error','You are Not the Owner of this listing');
     return res.redirect(req.get('Referer') || '/listing');
}
next();
}
 
// Check Review owner 
module.exports.rOwnerAuthenticated=async (req,res,next)=>{
  let r_id=req.params.r_id;
    if(!isValid(r_id)){
          throw new NewError(400,'Not Found');
        }
  let del_review=await review.findById(r_id).populate('auther');
  if(del_review && !del_review.auther._id.equals(req.user._id)){
     req.flash('error','You are Not the Auther of this comments');
     return res.redirect(req.get('Referer') || '/listing');
}
next();
}

//Joi Validation check middlewire
module.exports.checkJoi=(req,res,next)=>{
      let result=listingSchema.validate(req.body);
    if(result.error){
        throw new NewError(400,result.error);
    }
    next();
}

