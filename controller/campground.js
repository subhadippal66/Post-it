const Campground = require('../models/campground.js');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.newCampground = (req,res)=>{    
    res.render('campgrounds/new')
}

module.exports.submitNewCampground = async (req, res, next) => {    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.viewAcampground = async(req, res) => {
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
}

module.exports.editCampground = async(req, res) => {
    const {id} = req.params;
    //console.log(id);

    const campgrounds = await Campground.findById(id);
    if(!campgrounds){
        req.flash('error','Cannot find that Campground, Maybe its deleted or didnot exist');
        return res.redirect('/campgrounds');
    }
    //console.log(campgrounds);
    res.render('campgrounds/edit', {campgrounds});
}

module.exports.submitEditedCampground = async(req, res, next) => {
    const {id} = req.params;
    const findID = {_id : id};
    await Campground.findOneAndUpdate(findID , {...req.body.campground});
    req.flash('success', 'successfully updated the campground');
    res.redirect(`/campgrounds/${id}`); 	
}

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('delete', 'successfully deleted the campground')
    res.redirect('/campgrounds');
}