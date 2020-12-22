const mongoose = require("mongoose");
const path = require("path");
const { places, descriptors } = require('./seedshelper');
const cities = require('./cities');
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp2',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error :"));
db.once("open" , ()=>{
    console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

// const seeddb = async() => {
//     await campground.deleteMany({});
//     for(let i=0;i<50;i++){
//         const num = Math.floor(Math.random()*1000);
//         const campg = new campground({
//             location : `${cities[num].city} , ${cities[num].state}`,
//             name : `${sample(descriptors)} ${sample(places)}`
//         })
//         await campg.save();
//         console.log(campg.name);
//         console.log(campg.location);
//     }
// }


const seeddb = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // const random1000 = Math.floor(Math.random() * 1000);
        const random = Math.floor(Math.random()*1000) + 2000;
        const camp = new Camp({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, illo. Numquam enim perferendis in quae.Magnam amet explicabo hic adipisci commodi maxime rem ipsa ducimus id perspiciatis iste, ab odit!',
            price:random
        })
        await camp.save();
    }
}


seeddb().then(() => {
    mongoose.connection.close();
})