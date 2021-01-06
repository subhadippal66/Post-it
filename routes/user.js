const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {isLoggedIn} = require('../middleware');
const campground = require('../models/campground');

router.get('/register',async(req,res)=>{
    res.render('user/register');
})

router.post('/register', catchAsync(async(req,res,next)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({username,email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser , (err)=>{
            if(err) {return next(err)}
            req.flash('success', 'successfully registered');
            //console.log(registeredUser);
            res.redirect('/campgrounds');
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }

}));

router.get('/login', (req, res) => { 
    if(req.user){
        req.flash('success','You are already Logged In');
        return res.redirect('/campgrounds');
    }   
    res.render('user/login');
    //console.log(req.baseUrl);
});

router.get('/userProfile',isLoggedIn, catchAsync(async(req, res) => {
    const campgrounds = await campground.find({author : req.user._id});
    //console.log(camp);
    res.render('user/profile', {campgrounds});
}));

router.post('/login',passport.authenticate('local',{
    failureRedirect: '/login', failureFlash: true }), catchAsync(async(req, res) => {
        
        req.flash('success','Login Successfully, Welcome Back');
        //const reqUrl = req.session.requestedUrl || '/campgrounds';
        //delete req.session.requestedUrl;
        res.redirect('userProfile');
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Logged-Out, Maybe Visit Again');
    res.redirect('/campgrounds');
  });
  

module.exports = router;