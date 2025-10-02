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
  }
});
const listing=mongoose.model('listing',schema);
module.exports=listing;