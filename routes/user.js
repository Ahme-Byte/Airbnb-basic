const express=require('express');
const router=express.Router();
const passport=require('passport');
const {saveDestination}=require('../check.js');
const controlUser=require('../controllers/user.js');


//Route get,post SignUp
router.route('/signup').get(controlUser.gSignup).post(controlUser.pSignup)

//Route get,post Login
router.route('/login').get( controlUser.gLogin).post(saveDestination,passport.authenticate('local',{failureRedirect:'/user/login',failureFlash:true}), controlUser.pLogin);

//Route Logout
router.get('/logout', controlUser.logout);

module.exports=router;