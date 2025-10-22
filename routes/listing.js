const express=require('express');
const router=express.Router();
const {userAuthenticated,ownerAuthenticated,checkJoi}=require('../check.js');
const controlListing=require('../controllers/listings.js');
const multer=require('multer');
const {storage}=require('../cloudConfig.js');
const upload=multer({storage});

//Route listing
router.route('/').get(controlListing.home).post(checkJoi,upload.single('docu[image]'),controlListing.post);

//Route New Listing
router.get('/new',userAuthenticated,controlListing.new);

//Route edit
router.get('/edit/:id',userAuthenticated,controlListing.edit);

//Route patch,delete,get
router.route('/:id').patch(ownerAuthenticated,checkJoi,upload.single('docu[image]'),controlListing.update).delete(userAuthenticated,ownerAuthenticated,controlListing.destroy).get(controlListing.show)

module.exports=router;

