const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PassportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userschema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

// IT INCLUDES THE PASSWORD AN DUSERNAME ITSELF;
userschema.plugin(PassportLocalMongoose);
userschema.plugin(findOrCreate);

module.exports = mongoose.model('User',userschema);