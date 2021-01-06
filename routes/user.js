const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const user = require('../controller/user');
const passport = require('passport');

router.get('/register',user.register);
router.post('/register', catchAsync(user.registerUser));
router.get('/login', user.login);
router.get('/userProfile',isLoggedIn, catchAsync(user.userProfile));
router.post('/login',passport.authenticate('local',{
    failureRedirect: '/login', failureFlash: true }), catchAsync(async(req, res) => {
        
        req.flash('success','Login Successfully, Welcome Back');
        //const reqUrl = req.session.requestedUrl || '/campgrounds';
        //delete req.session.requestedUrl;
        res.redirect('userProfile');
}));
router.get('/logout',user.logout);
  
module.exports = router;