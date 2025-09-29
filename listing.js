const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  title:{
    type:String,
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
    default:'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hellosingaporetours.com%2Fblog%2Fplaces-to-visit-in-singapore-top-10-tourist-attractions&psig=AOvVaw1BDt_K22m5L89v05wNZE1k&ust=1758715368586000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKCK_ILr7o8DFQAAAAAdAAAAABAE',
   set:(v)=>v===''?'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hellosingaporetours.com%2Fblog%2Fplaces-to-visit-in-singapore-top-10-tourist-attractions&psig=AOvVaw1BDt_K22m5L89v05wNZE1k&ust=1758715368586000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKCK_ILr7o8DFQAAAAAdAAAAABAE':v
    }
  },
  price:{
    type:Number
  },
  location:{
    type:String
},
  country:{
    type:String,
  }
});
const listing=mongoose.model('listing',schema);
module.exports=listing;