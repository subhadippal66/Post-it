const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const user = require('../controller/user');
const passport = require('passport');
const {pathMiddleware} = require('../middleware');

router.get('/register',pathMiddleware,user.register);
router.post('/register', catchAsync(user.registerUser));
router.get('/login',pathMiddleware, user.login);
router.get('/userProfile',isLoggedIn, catchAsync(user.userProfile));
router.post('/login',passport.authenticate('local',{
    failureRedirect: '/login', failureFlash: true }), catchAsync(async(req, res) => {
        
        req.flash('success','Login Successfully, Welcome Back');
        //console.log(req.baseUrl);
        const reqUrl = req.session.requestedUrl || '/';
        res.redirect(reqUrl);
        delete req.session.requestedUrl;
        
}));
router.get('/logout',pathMiddleware, user.logout);
  
module.exports = router;