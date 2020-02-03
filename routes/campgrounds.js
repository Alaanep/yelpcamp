var express			= require('express'),
	Campground 		= require('../models/campgrounds'),
	middleware		= require('../middleware'),
	router			= express.Router();

//index - view all campground
router.get('/', function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds:campgrounds});
		}
	})
	
})
//new - show new campround form
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new')
})

//create - create new campground
router.post('/', middleware.isLoggedIn,  function(req, res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author= {
		id: req.user._id,
		username: req.user.username
	};
	var price=req.body.price
	var newCampground = {name: name, image: image, description: description, author: author, price: price};
	Campground.create(newCampground, function(err, newCampground){
		if(err){
			req.flash("error", "Something went wrong!");
			console.log(err);
		} else {
				req.flash("success", "Successfyllu created campground!");
				res.redirect('/campgrounds');
		}
	})
	
});

//show - shows more info about one campground
router.get('/:id', function(req, res){
	//find the campground  with provided id
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampGround){
		if(err || !foundCampGround){
			req.flash("error", "Campground not found!");
			console.log(err);
			res.redirect('back');
		} else{
			res.render('campgrounds/show', {campground: foundCampGround});
		}
	}) 
})

//edit campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampGround){
		res.render('campgrounds/edit', {campground: foundCampGround});
	});	
			
});
//update campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,  function(err, updatedCampGround){
		if(err){
			req.flash("error", "Something went wrong!");
			console.log(err);
			res.redirect('/campgrounds');
		} else{
			req.flash("success", "Successfyllu updated campground!");
			res.redirect('/campgrounds/' + updatedCampGround._id);
		}
	})
})

//delete campround 
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, ){
		if(err){
			req.flash("error", "Something went wrong!");
			res.redirect('/campgrounds')
		} else {
			req.flash("success", "Successfyllu deleted campground!");
			res.redirect('/campgrounds')
		}
	})
})

module.exports=router;