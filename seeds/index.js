const mongoose = require("mongoose");
const { places, descriptors } = require('./seedshelper');
const cities = require('./cities');
const Camp = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp2',{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error :"));
db.once("open" , ()=>{
    console.log('Database connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seeddb = async () => {
    await Camp.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random = Math.floor(Math.random()*1000) + 2000;
        const camp = new Camp({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author:'5fe97af1a8e3760ec0500e51',
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://source.unsplash.com/collection/483251',
                  filename: 'YelpCamp/it7voez8pxdqeh3jkewj'
                },
                {
                  url: 'https://source.unsplash.com/collection/483251',
                  filename: 'YelpCamp/euvycgjcuqhz0cc0dzc0'
                }
            ],
            description:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus, illo. Numquam enim perferendis in quae.Magnam amet explicabo hic adipisci commodi maxime rem ipsa ducimus id perspiciatis iste, ab odit!',
            price:random
        })
        // console.log(camp);
        await camp.save();
    }
}


seeddb().then(() => {
    mongoose.connection.close();
})