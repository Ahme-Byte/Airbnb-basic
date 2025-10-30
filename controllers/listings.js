const {listing}=require('../listing');
const mongoose=require('mongoose');
const NewError=require('../error.js');
const {listingSchema}=require('../joi.js');

//Checking Id 
const isValid=(id)=>mongoose.Types.ObjectId.isValid(id);

//Home
module.exports.home=async (req,res)=>{
  const {category,destination}=req.query;
  let filter={};
  if(destination){
   filter.$or=[
    {location:{$regex:destination,$options:'i'}},
    {country:{$regex:destination,$options:'i'}},
    {title:{$regex:destination,$options:'i'}}
   ];
  }
  if (category==='trending'){
   const items= await listing.aggregate([{$addFields:{countReview:{$size:'$ratings'}}},
      {$sort:{countReview:-1}},
      {$limit:20}
    ]);
    return res.render('index',{items,destination,category});
  }
  if(category){
    filter.category=category;
  }
          const items=await listing.find(filter);
    res.render('index',{items,category,destination});
};

//New
module.exports.new= (req,res)=>{
    res.render('new');
}

//Post
module.exports.post=async (req,res)=>{
    const new_listing=new listing(req.body.docu);
      new_listing.owner=req.user._id;
      let url=req.file.path;
      let filename=req.file.filename;
      new_listing.image={url,filename};
      let {location,country}=req.body.docu;
      let place=`${location},${country}`;
      let geoUrl=`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
     const geoCode=await fetch(geoUrl);
     const finalGeoCode=await geoCode.json();
     new_listing.geoCoding={type:'Point',coordinates:[parseFloat(finalGeoCode[0].lon),parseFloat(finalGeoCode[0].lat)]};
    await new_listing.save();
    req.flash('success','New Lising Added!');
    res.redirect('/listing');
}

//Edit
module.exports.edit=async (req,res)=>{
      const{id}=req.params;
        if(!isValid(id)){
          throw new NewError(400,'Not Found');
        }
     const items=await listing.findById(id);
     if(!items){
         throw new NewError(404,'Invalid Id');
     }
     let imageUrl=items.image.url.replace('/upload','/upload/h_250,w_250');
      res.render('edit',{items,imageUrl});
}

//Update
module.exports.update=async (req,res)=>{
    const id=req.params.id;
    let final_list=await listing.findByIdAndUpdate(id,{...req.body.docu});
    if(typeof req.file !== 'undefined'){
      let url=req.file.path;
      let filename=req.file.filename
      final_list.image={url,filename};
     await final_list.save();
    }
     req.flash('success','Listing Updated!');
    res.redirect(`/listing/${id}`);
}

//Destroy
module.exports.destroy=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
     req.flash('success','Listing Deleted!');
    res.redirect('/listing');
}

//Show
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    if(!isValid(id)){
      throw new NewError(400,'Not Found');
    }
     const items=await listing.findById(id).populate({path:'ratings',populate:{path:'auther'}}).populate('owner');
     if(!items){
        throw new NewError(404,'Invalid Id');
     }
     res.render('show',{items});
}