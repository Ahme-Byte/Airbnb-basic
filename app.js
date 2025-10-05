const express=require('express');
const app=express();
const engine=require('ejs-mate');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const NewError=require('./error.js');
const cors=require('cors');
const {userSchema,userReview}=require('./joi.js');
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));

//Mongoose Setup
const url='mongodb://127.0.0.1:27017/wanderlast';
const {listing,review}=require('./listing');
//Checking Id 
const isValid=(id)=>mongoose.Types.ObjectId.isValid(id);
main()
.then((r)=>{
    console.log('Connection Successfull');
})
.catch((e)=>{
    console.log(e.message);
})
async function main(){
await mongoose.connect(url);
}

app.use(cors());

//Route Home
app.get('/',(req,res)=>{
    res.send('Welcome to root');
})
//Route listing
app.get('/listing',async (req,res)=>{
          const items=await listing.find();
    res.render('index',{items});
})

//Route New Listing
app.get('/listing/new',(req,res)=>{
    res.render('new');
})

//Route Post Listing
app.post('/listing',async (req,res)=>{
    let result=userSchema.validate(req.body);
    if(result.error){
        throw new NewError(400,result.error);
    }
    const new_listing=new listing(req.body.docu);
    await new_listing.save();
    res.redirect('/listing');
})

//Route Reviews get form
app.get('/listing/:id/ratings',(req,res)=>{
    let {id}=req.params;
    res.render('rating.ejs',{id});
})

//Route Reviews post form
app.post('/listing/:id/ratings',async (req,res)=>{
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
    throw new NewError(404,'Invalid Id')
   }
     await review1.save();
   list.ratings.push(review1);
   await list.save();
   res.redirect(`/listing/${id}`);
})

//Route edit
app.get('/listing/edit/:id',async (req,res)=>{
      const{id}=req.params;
      if(!isValid(id)){
        throw new NewError(400,'Not Found');
      }
     const items=await listing.findById(id);
     if(!items){
         throw new NewError(404,'Invalid Id');
     }
      res.render('edit',{items});
})

//Route review delete
app.delete('/listing/:l_id/review/:r_id',async (req,res)=>{
    let {l_id,r_id}=req.params;
    await review.findByIdAndDelete(r_id);
    await listing.findByIdAndUpdate(l_id,{$pull:{ratings:r_id}})
    res.redirect(`/listing/${l_id}`);
})

//Route Update
app.patch('/listing/:id',async (req,res)=>{
    const {id}=req.params;
      if(!isValid(id)){
        throw new NewError(400,'Not Found');
      }
     let result= userSchema.validate(req.body);
     if(result.error){
        throw new NewError(400,result.error)
     }
    await listing.findByIdAndUpdate(id,{...req.body.docu});
    res.redirect(`/listing/${id}`);
})

//Route Delete
app.delete('/listing/:id',async (req,res)=>{
    let {id}=req.params;
    const delete_item=await listing.findByIdAndDelete(id);
    res.redirect('/listing');
})

//Route title
app.get('/listing/:id',async(req,res)=>{
    let {id}=req.params;
    if(!isValid(id)){
      throw new NewError(400,'Not Found');
    }
     const items=await listing.findById(id).populate('ratings');
     if(!items){
        throw new NewError(404,'Invalid Id');
     }
     res.render('show',{items});
})

//Route for All req and routes
app.use((req,res)=>{
  throw new NewError(404,'Page Not Found');
})

//Error Handler Middlewire
app.use((err,req,res,next)=>{
    const{status=500,message='Something went wrong'}=err;
    res.status(status).render('error.ejs',{message});
})


//App is Listenig
app.listen(8080,()=>{
    console.log('Port is listening on 8080');
})