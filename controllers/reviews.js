const Camp = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async(req,res)=>{
    console.log(req.params);
    const campground = await Camp.findById(req.params.id);
    const review = new Review(req.body.Review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req,res) => {
    const { id, reviewId } = req.params;
    await Camp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}