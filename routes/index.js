var express			= require('express'),
	passport 		= require('passport'),
	User  			= require('../models/users'),
	router			= express.Router();


router.get('/', function(req, res){
	res.render('landing');
})

//==================
//AUTH ROUTES
//==================

router.get('/register', function(req, res){
	res.render('register');
});

//handling user sign up
router.post('/register', function(req, res){
	var newUser= new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", "Error, " + err.message);
			console.log(err);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, function(){
			req.flash('success', 'You are successfully signed up!');
			res.redirect('/campgrounds');
		})
	})
})

//show login form
router.get('/login', function(req, res){
	res.render('login');
});


//handling login logic
router.post('/login', passport.authenticate('local', {
 	successRedirect: '/campgrounds',
 	failureRedirect: '/login'
 }), function(req, res){
})

//handle logout
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'Logged You out!');
	res.redirect('/campgrounds');
})

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}

module.exports=router;