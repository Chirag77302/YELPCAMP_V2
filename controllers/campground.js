const Camp = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});

module.exports.index = async(req,res) =>{
    const allcampgrounds = await Camp.find({});
    res.render('campgrounds/index',{ allcampgrounds });
}

module.exports.renderNewForm = (req, res) => {
    console.log('reached new form ');
    res.render('campgrounds/new');
}

module.exports.CreateCampground = async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();

    const new_campground = new Camp(req.body.campground);
    new_campground.geometry = geoData.body.features[0].geometry;
    new_campground.images = req.files.map(f => ({url:f.path , filename:f.filename}));
    new_campground.author = req.user._id;
    await new_campground.save();
    console.log(new_campground);
    req.flash('success','Successfully added new campground');
    res.redirect(`/campgrounds/${new_campground._id}`);
}

module.exports.showCampground = async(req,res) =>{
    const campgroundis = await Camp.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campgroundis);

    if(!campgroundis){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{ campgroundis });
}

module.exports.renderEditForm = async(req,res)=>{
    const campground = await Camp.findById(req.params.id);
    if(!campground){
        req.flash('error','Campground not found');
        return res.redirect('/campgrounds');
    }
    console.log('got it');
    res.render('campgrounds/edit',{ campground });

}

module.exports.updateCampground = async(req,res)=>{
    console.log('works');
    const { id } = req.params;
    console.log(req.body);
    const campground =  await Camp.findByIdAndUpdate(id,{...req.body.campground});
    const imgs = req.files.map(f => ({url:f.path , filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}});
        console.log(campground);
    }
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Camp.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}