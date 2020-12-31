const express = require('express');
const router = express.Router({mergeParams:true});
const Camp = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const {CampgroundSchema} = require('../schemas.js');
const {isLoggedIn , validateCampground , isAuthor} = require('../middleware.js');
const campgrounds = require('../controllers/campground');
const {storage} = require('../cloudinary/index');
const multer  = require('multer')
const upload = multer({ storage })

router.get('/',catchAsync(campgrounds.index));

router.get('/new', isLoggedIn ,campgrounds.renderNewForm);


router.get('/:id',catchAsync(campgrounds.showCampground));

router.post('/', isLoggedIn, upload.array('image') ,validateCampground,  catchAsync(campgrounds.CreateCampground));
// router.post('/', upload.array('image') , (req,res)=>{
    // console.log(req.body , req.file);
    // res.send('it worked');
// });


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));



router.put('/:id', isLoggedIn,upload.array('image') , validateCampground , catchAsync(campgrounds.updateCampground));

router.delete('/:id',isLoggedIn,catchAsync(campgrounds.deleteCampground));

module.exports = router;