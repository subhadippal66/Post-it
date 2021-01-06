const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

router.get('/', CatchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new',isLoggedIn, (req,res)=>{    
    res.render('campgrounds/new')
})

router.post('/',validateCampground,isLoggedIn, CatchAsync(async (req, res, next) => {    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id', CatchAsync(async(req, res) => {
    const {id}= req.params;
    //console.log(req.user);
    //const user = req.user;
    const campgrounds = await Campground.findById(id).populate({
        path:'reviews',
        populate: {path:'author'}
        }).populate('author');
    
    if(!campgrounds){
        req.flash('error','Cannot find that Campground, Maybe its deleted or didnot exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campgrounds});
}));

router.get('/:id/edit',isLoggedIn,isAuthor, CatchAsync(async(req, res) => {
    const {id} = req.params;
    //console.log(id);

    const campgrounds = await Campground.findById(id);
    if(!campgrounds){
        req.flash('error','Cannot find that Campground, Maybe its deleted or didnot exist');
        return res.redirect('/campgrounds');
    }
    //console.log(campgrounds);
    res.render('campgrounds/edit', {campgrounds});
}));

router.put('/:id', validateCampground,isLoggedIn,isAuthor, CatchAsync(async(req, res, next) => {
    const {id} = req.params;
    const findID = {_id : id};
    await Campground.findOneAndUpdate(findID , {...req.body.campground});
    req.flash('success', 'successfully updated the campground');
    res.redirect(`/campgrounds/${id}`); 	
}));

router.delete('/:id',isLoggedIn,isAuthor, CatchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('delete', 'successfully deleted the campground')
    res.redirect('/campgrounds');
}));


module.exports = router;