const express=require('express');
const app=express();
const engine=require('ejs-mate');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
//Mongoose Setup
const url='mongodb://127.0.0.1:27017/wanderlast';
const listing=require('./listing');
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
    const {docu}=req.body;
    const new_listing=new listing(docu);
    await new_listing.save();
    res.redirect('/listing');
})

//Route edit
app.get('/listing/edit/:id',async (req,res)=>{
      const{id}=req.params;
     const items =await listing.findById(id);
      res.render('edit',{items});
})

//Route Update
app.patch('/listing/:id',async (req,res)=>{
    const {id}=req.params;
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
     const items=await listing.findById(id);
     res.render('show',{items});

})







//App is Listenig
app.listen(8080,()=>{
    console.log('Port is listening on 8080');
})