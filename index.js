const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/expressError');

const engine = require('ejs-mate');
app.engine('ejs', engine);

app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(methodOverride('_method'));
app.use(express.static('public'));
const sessionConfig = {
    secret: 'secretfile',
    httpOnly: true,
    cookie: {
        expires : Date.now() + (1000*60*60*24*7),
        maxAge : 1000*60*60*24*7
    },
    resave: false,
    saveUninitialized: true
  }
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.deleted = req.flash('delete')
    res.locals.reviewAdded = req.flash('reviewAdded');
    res.locals.reviewDeleted = req.flash('reviewDeleted');
    res.locals.error = req.flash('error');
    next();
})

//mongoose connections
mongoose.connect('mongodb://localhost/tourPlace', {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology: true})
    .then(()=>{
        console.log('connected to db');
    })
    .catch(err =>{
        console.log('Failed to connect')
        console.log(err);
    })

mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname , 'views'));

//starting the port
app.listen(3000, () => {
    console.log(`Server started on port`);
});

//showpage route
app.get('/', (req, res) => {
    res.render('home')
});

//campground route
const campgroundRouter = require('./routes/campgroundRoute');
app.use('/campgrounds', campgroundRouter);

//reviews route
const reviewRouter = require('./routes/reviewRoute');
const { date } = require('joi');
app.use('/campgrounds/:id/review', reviewRouter);

//error handelor
app.all('*',(req,res,next) =>{
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {message= 'error' , statusCode=500} = err;
    res.status(statusCode).render('error', {err});
});