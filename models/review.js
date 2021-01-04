const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reviewSchema = new schema({
    body : {
       type: String,
       required:[true, 'Details is required']},
    rating : Number
})

module.exports = mongoose.model('Review', reviewSchema);