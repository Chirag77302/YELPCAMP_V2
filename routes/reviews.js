const express = require('express');
const router = express.Router({mergeParams:true});
const Camp = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const {ReviewSchema} = require('../schemas.js');
const {isLoggedIn , validateReview , isReviewAuthor } = require('../middleware.js');
const reviews = require('../controllers/reviews');


router.post('/', isLoggedIn , validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn , isReviewAuthor  , catchAsync(reviews.deleteReview));

module.exports = router;