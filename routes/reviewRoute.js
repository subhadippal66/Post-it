const express = require('express');
const router = express.Router({mergeParams : true});
const CatchAsync = require('../utils/catchAsync');
const review = require('../controller/reviews');

const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware')

router.post('/',isLoggedIn, validateReview, CatchAsync(review.createReview));
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, CatchAsync(review.deleteReview));

module.exports = router;