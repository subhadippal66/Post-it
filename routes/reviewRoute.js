const express = require('express');
const router = express.Router({mergeParams : true});
const CatchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground.js');
const Review = require('../models/review');

const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware')

router.post('/',isLoggedIn, validateReview, CatchAsync(async(req, res) => {
    const {id} = req.params;
    const campground =await Campground.findById(id);
    const review = new Review(req.body);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('reviewAdded','Thank you for reviewing this campground')
    res.redirect(`/campgrounds/${id}`);
    
}));

//delete review

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, CatchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('reviewDeleted', 'Review Deleted')
    res.redirect(`/campgrounds/${id}`);
}));



module.exports = router;