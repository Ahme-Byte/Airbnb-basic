const { required } = require('joi');
const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  image:{
    filename:{
      type:String,
      default:'listing_image'
    },
    url:{
    type:String,
    default:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&ixlib=rb-4.0.3',
   set:(v)=>v===''?'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&ixlib=rb-4.0.3':v
    }
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
},
  country:{
    type:String,
    required:true
  },
  ratings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'review'
  }]
});
schema.post('findOneAndDelete',async function(doc){
  if (!doc || doc.ratings.length===0){
    console.log('empty rating array');
  }else{
   await review.deleteMany({_id:{$in:doc.ratings}})
  }


})
const listing=mongoose.model('listing',schema);
const reviewSchema=new mongoose.Schema({
  range:{
    type:Number,
    min:1,
    max:5,
    required:true
  },
  comment:{
    type:String,
    required:true,
    maxlength:500
  }
})
const review=mongoose.model('review',reviewSchema,);
module.exports={listing,review};
