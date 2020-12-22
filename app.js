const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require('ejs-mate');
const methodoverride = require('method-override');
const Camp = require('./models/campground');

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

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname , 'views'));
app.use(express.urlencoded({ extended: true}));
app.use(methodoverride('_method'));


app.get("/",(req,res) =>{
    console.log('connected');
    res.render('home');
});


app.get('/campgrounds',async(req,res) =>{
    const allcampgrounds = await Camp.find({});
    res.render('campgrounds/index',{ allcampgrounds });
})


app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.get('/campgrounds/:id',async(req,res) =>{
    const campgroundis = await Camp.findById(req.params.id);
    res.render('campgrounds/show',{ campgroundis });
})

app.post('/campgrounds',async(req,res)=>{
   const new_campground = new Camp(req.body.campground);
   new_campground.save();
   res.redirect(`/campgrounds/${new_campground._id}`);
});

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Camp.findById(req.params.id);
    console.log('got it');
    res.render('campgrounds/edit',{ campground });

})

app.put('/campgrounds/:id',async(req,res)=>{
    console.log('works');
    const { id } = req.params;
    const campground =  await Camp.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    console.log('delete works');
    const { id } = req.params;
    await Camp.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.listen(3000,()=>{
    console.log("THE APP STARTS , WE SERVE PORT 3000");
});