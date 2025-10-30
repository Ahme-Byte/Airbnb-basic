const express=require('express');
const app=express();
const engine=require('ejs-mate');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const cookieParser=require('cookie-parser');
const NewError=require('./error.js');
const cors=require('cors');
const listingRoute=require('./routes/listing.js');
const reviewRoute=require('./routes/review.js');
const userRoute=require('./routes/user.js');
const MongoStore = require('connect-mongo');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStratigy=require('passport-local');
const {user}=require('./listing.js');

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//const url='mongodb://127.0.0.1:27017/wanderlast';
const url='mongodb+srv://ahmipersonal05_db_user:fireFree%4001wanderlust@cluster0.qpst8rv.mongodb.net/wanderlast?retryWrites=true&w=majority'

//packages Middlewires
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(cookieParser('secretcode'));
require('dotenv').config();

//Connect-mongo Session Stroge
const store=MongoStore.create({
  mongoUrl:url,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
})

const sessionSetup={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:false
    }
};
app.use(session(sessionSetup));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratigy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//Mongoose Setup
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

//For all Method
app.use(cors());

//Middlewire
app.use((req,res,next)=>{
    res.locals.sucMsg=req.flash('success');
   res.locals.errMsg=req.flash('error');
   res.locals.currUser=req.user;
    next();
})
//Routes
app.use('/listing',listingRoute);
app.use('/listing/:id/review',reviewRoute);
app.use('/user',userRoute);

//Route for All req and routes
app.use((req,res)=>{
  throw new NewError(404,'Page Not Found');
})

//Error Handler Middlewire
app.use((err,req,res,next)=>{
    const{status=500,message='Something went wrong'}=err;
    res.status(status).render('error.ejs',{message});
})

/*App is Listenig
app.listen(8080,()=>{
    console.log('Port is listening on 8080');
})*/