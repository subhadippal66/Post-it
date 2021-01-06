const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review');

const campground = new schema({
    title : {
        type : String,
        required :true
    },
    price : {
        type : Number,
        required : true
    },
    description : String,
    location : String,
    image : String,
    author : {
        type: schema.Types.ObjectId,
        ref:'User'
    },
    reviews : [
        {
            type : schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campground.post('findOneAndDelete', async(doc)=>{
    //console.log(doc.reviews);
        if(doc){
        await Review.deleteMany({
            _id : {$in: doc.reviews}
        })
    }
});

module.exports = mongoose.model('Campground', campground);