const passport_local_mongoose=require('passport-local-mongoose');
const mongoose=require('mongoose');

//Listing Schema
const schema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  image:{
  url:String,
  filename:String
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
},
geoCoding: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category:{
  type:String,
  enum:['rooms','iconic_city','mountainous','castle','pool','camping','farm','arctic','domes','boats']
  },
  country:{
    type:String,
    required:true
  },
  ratings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'review'
  }],
  owner:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
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

//Review Schema
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
  },
  auther:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
  }
})
const review=mongoose.model('review',reviewSchema,);

//User Schema
const userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  }
})
userSchema.plugin(passport_local_mongoose);
const user=mongoose.model('user',userSchema);

module.exports={listing,review,user};
