if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require('ejs-mate');
const joi = require('joi');
const methodoverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');
const catchAsync = require('./utils/catchAsync');


const campgroundroutes = require('./routes/campground');
const reviewroutes = require('./routes/reviews');
const authroutes = require('./routes/users');

const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/yelpcamp2',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error :"));
db.once("open" , ()=>{
    console.log('Database connected');
})

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname , 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodoverride('_method'));
app.use(express.static(path.join(__dirname , 'public')));
app.use(mongoSanitize());

const sessionconfig = {
    name:'sess',
    secret:'Iron man is the best',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionconfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//THE LOCAL MONGOOSE CONTAINS THIS AS A PRE-DEFINDE FUNCTION ALREADY 
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

// FLASH MIDDLEWARE
app.use((req,res,next)=>{
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
    function(accessToken, refreshToken, profile,email, done) {
        //check user table for anyone with a facebook ID of profile.id
        console.log('profile is ------ ')
        console.log(profile);
        // console.log(email);
        User.findOne({
            email: email.emails[0].value
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: email.emails[0].value,
                    provider: 'google',
                    //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                    google: profile._json
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
));



app.use('/',authroutes);
app.use('/campgrounds',campgroundroutes);
app.use('/campgrounds/:id/reviews',reviewroutes);

app.get("/",(req,res) =>{
    console.log('connected');
    res.render('home');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/register' }),
  function(req, res) {
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    // Successful authentication, redirect home.
    res.redirect(redirectUrl);
  });


app.all('*',(req,res,next)=>{
    next(new ExpressError(req.message,404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message)err.message = 'SOMETHING WENT WRONG ! PAGE NOT FOUND';
    res.status(statusCode).render('error',{ err });
});

app.listen(3000,()=>{
    console.log("THE APP STARTS , WE SERVE PORT 3000");
});