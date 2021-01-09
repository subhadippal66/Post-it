const Campground = require('../models/campground.js');
const {cloudinary} = require('../cloudinary/index');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.newCampground = (req,res)=>{    
    res.render('campgrounds/new')
}

module.exports.submitNewCampground = async (req, res, next) => { 
    //console.log(req.body);   
    const geoData= await geocodingClient.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.image = req.files.map(f => ({
        path: f.path , name : f.filename
    }))
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
    const camp = await Campground.findById(id);
    for(let img of camp.image){
        await cloudinary.uploader.destroy(img.name);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('delete', 'successfully deleted the campground')
    res.redirect('/campgrounds');
}