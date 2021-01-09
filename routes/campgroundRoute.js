const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/catchAsync');

const campground = require('../controller/campground');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const multer  = require('multer')

const {storage} = require('../cloudinary/index');
const upload = multer({ storage })

router.route('/')
    .get(CatchAsync(campground.index))
    .post(validateCampground,isLoggedIn, upload.array('image',2), CatchAsync(campground.submitNewCampground))
    

router.get('/new',isLoggedIn, campground.newCampground);

router.route('/:id')
    .get(CatchAsync(campground.viewAcampground))
    .put(validateCampground,isLoggedIn,isAuthor, CatchAsync(campground.submitEditedCampground))
    .delete(isLoggedIn,isAuthor, CatchAsync(campground.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor, CatchAsync(campground.editCampground));

module.exports = router;