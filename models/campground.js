
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const Review = require('./review');

//https://res.cloudinary.com/dzlixlemv/image/upload/b_rgb:000000,c_pad,h_500,w_500/sample.jpg
const ImageSchema = new schema(
    {
        path : String,
        name : String
    }
)
ImageSchema.virtual('thumbnail').get(function(){
    return this.path.replace('/upload', '/upload/b_rgb:141526,c_pad,h_1000,w_1000');
});

const opts = {
    toJSON : {virtuals:true}
};
const campground = new schema({
    title : {
        type : String,
        required :true
    },

    geometry:{
        type: {
            type: String, 
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    description : String,
    location : String,
    image : [ImageSchema],
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
}, opts);
campground.virtual('properties.popup').get(function(){
    return [this._id, this.title, this.location];
})


campground.post('findOneAndDelete', async(doc)=>{
    //console.log(doc.reviews);
        if(doc){
        await Review.deleteMany({
            _id : {$in: doc.reviews}
        })
    }
});

module.exports = mongoose.model('Campground', campground);