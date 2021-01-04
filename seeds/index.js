const mongoose = require('mongoose');
const Campground = require('./../models/campground.js');
const cities = require('./cities.js');
const {places, descriptors} = require('./seedHelpers');

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

const sample = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i =0; i<50 ; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/357786/640x360',
            description:'Therefore, a campground consists typically of open pieces of ground where a camper can pitch a tent or park a camper. More specifically a campsite is a dedicated area set aside for camping and for which often a user fee is charged. Campsites typically feature a few (but sometimes no) improvements. Dedicated campsites',
            price: Math.floor(Math.random()*5000) + 2000
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close()
})