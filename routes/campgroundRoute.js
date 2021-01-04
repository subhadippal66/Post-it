const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/expressError');
const CatchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground.js');

const joiSchema = require('../joiSchemas');

const validateCampground = (req,res,next) =>{
        //console.log(campgroundSchema.validate(req.body));
    const {error} = joiSchema.campgroundSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }
    else{
        next();
    }
};


router.get('/', CatchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})

router.post('/',validateCampground, CatchAsync(async (req, res, next) => {    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.get('/:id', CatchAsync(async(req, res) => {
    const {id}= req.params;
    const campgrounds = await Campground.findById(id).populate('reviews');
    if(!campgrounds){
        req.flash('error','Cannot find that Campground, Maybe its deleted or didnot exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campgrounds});
}));

router.get('/:id/edit', CatchAsync(async(req, res) => {
    const {id} = req.params;
    //console.log(id);
    const campgrounds = await Campground.findById(id);
    //console.log(campgrounds);
    res.render('campgrounds/edit', {campgrounds});
}));

router.put('/:id', validateCampground, CatchAsync(async(req, res, next) => {
    const {id} = req.params;
    const findID = {_id : id};
    await Campground.findOneAndUpdate(findID , {...req.body.campground});
    req.flash('success', 'successfully updated the campground');
    res.redirect(`/campgrounds/${id}`); 	
}));

router.delete('/:id',CatchAsync(async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('delete', 'successfully deleted the campground')
    res.redirect('/campgrounds');
}));


module.exports = router;