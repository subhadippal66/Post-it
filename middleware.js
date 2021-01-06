const passport = require('passport');
const joiSchema = require('./joiSchemas');
const ExpressError = require('./utils/expressError');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req,res,next)=>{
    req.session.requestedUrl = req.originalUrl;
    //console.log(req.session.requestedUrl);
    if(!req.isAuthenticated()){
        req.flash('error','You must Log-In first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req,res,next) =>{
    //console.log(campgroundSchema.validate(req.body));
const {error} = joiSchema.campgroundSchema.validate(req.body);
if(error){
    throw new ExpressError(error, 400);
}
else{
    next();
}
};

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const camp_ = await Campground.findById(id);
    if(!camp_.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review_ = await Review.findById(reviewId);
    if(!review_.author.equals(req.user._id)){
        req.flash('error', 'You Cannot delete Other users comment');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) =>{
    
    //console.log(campgroundSchema.validate(req.body));
    const {error} = joiSchema.reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }
    else{
        next();
    }
};