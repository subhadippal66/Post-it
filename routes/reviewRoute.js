const express = require('express');
const router = require('express').Router({mergeParams : true});


const ExpressError = require('../utils/expressError');
const CatchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground.js');
const Review = require('../models/review');

const joiSchema = require('../joiSchemas');

const validateReview = (req,res,next) =>{
    
    //console.log(campgroundSchema.validate(req.body));
    const {error} = joiSchema.reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }
    else{
        next();
    }
};

router.post('/',validateReview, CatchAsync(async(req, res) => {
    const {id} = req.params;
    const campground =await Campground.findById(id);
    const review = new Review(req.body);
    
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('reviewAdded','Thank you for reviewing this campground')
    res.redirect(`/campgrounds/${id}`);
    
}));

//delete review

router.delete('/:reviewId', CatchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('reviewDeleted', 'Review Deleted')
    res.redirect(`/campgrounds/${id}`);
}));



module.exports = router;