const express=require('express');
const router=express.Router({mergeParams:true});
const {userAuthenticated,rOwnerAuthenticated}=require('../check.js');
const controlReview=require('../controllers/review.js');

//Route Reviews get form
router.get('/',userAuthenticated,controlReview.get)

//Route Reviews post form
router.post('/',userAuthenticated,controlReview.post);

//Route review delete
router.delete('/:r_id',userAuthenticated,rOwnerAuthenticated,controlReview.destroy);

module.exports=router;
