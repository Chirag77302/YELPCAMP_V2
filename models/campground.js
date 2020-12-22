const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campground = new Schema({
    ttitle: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Camp',campground);