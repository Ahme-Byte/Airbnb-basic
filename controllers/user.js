const {user}=require('../listing.js');
const {userSchema}=require('../joi.js');

//Get Signup
module.exports.gSignup=(req,res)=>{
    res.render('signup.ejs');
};

async(req,res,next)=>{
    try{
      let {error,value} =userSchema.validate(req.body);
      if(error){
        throw new NewError(400,error)
      }
    let{username,email,password}=value;
        let user1=new user({username,email})
     let registerUser=await user.register(user1,password);
     req.login(registerUser,(err)=>{
        if(err){
        next(err);
        }
           req.flash('success','Well-come To WanderLast');
     res.redirect('/listing');
     });
    }catch(e){
    req.flash('error',e.message);
        res.redirect('/signup');     
    }
}

//Post Signup
module.exports.pSignup=async(req,res,next)=>{
    try{
      let {error,value} =userSchema.validate(req.body);
      if(error){
        throw new NewError(400,error)
      }
    let{username,email,password}=value;
        let user1=new user({username,email})
     let registerUser=await user.register(user1,password);
     req.login(registerUser,(err)=>{
        if(err){
        next(err);
        }
           req.flash('success','Well-come To WanderLast');
     res.redirect('/listing');
     });
    }catch(e){
    req.flash('error',e.message);
        res.redirect('/signup');     
    }
}

//Get Login
module.exports.gLogin=(req,res)=>{
    res.render('login.ejs');
}

//Post Login
module.exports.pLogin=(req,res)=>{
    let originalUrl=req.originalUrl || '/listing';
    req.flash('success','Well-come Back To WanderLust');
     res.redirect(originalUrl);
}

//Logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash('success','You are Logged out!')
        res.redirect('/listing');
    })
}