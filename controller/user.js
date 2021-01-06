const User = require('../models/user');
const campground = require('../models/campground');

module.exports.register = async(req,res)=>{
    res.render('user/register');
}

module.exports.registerUser = async(req,res,next)=>{
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
}

module.exports.login = (req, res) => { 
    if(req.user){
        req.flash('success','You are already Logged In');
        return res.redirect('/campgrounds');
    }   
    res.render('user/login');
    //console.log(req.baseUrl);
}

module.exports.userProfile = async(req, res) => {
    const campgrounds = await campground.find({author : req.user._id});
    //console.log(camp);
    res.render('user/profile', {campgrounds});
}

module.exports.loginUser = 

module.exports.logout = (req, res)=> {
    req.logout();
    req.flash('success', 'Logged-Out, Maybe Visit Again');
    res.redirect('/campgrounds');
}