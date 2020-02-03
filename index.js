var 	express			= require('express'),
		app				= express(),
		bodyParser 		= require('body-parser'),
		mongoose 		= require('mongoose'),
		flash 			= require('connect-flash'),
		Campground  	= require('./models/campgrounds'),
		Comment  		= require('./models/comments'),
		User  			= require('./models/users'),
		methodOverride	= require('method-override'),
		seedDB 			= require('./seed'),
		passport 		= require('passport'),
		LocalStrategy	= require('passport-local'),
		passportLocalMongoose 	= require('passport-local-mongoose');

var campgroundRoutes	= require('./routes/campgrounds'),
	commentRoutes		= require('./routes/comments'),
	indexRoutes			= require('./routes/index');	

//app config
//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v4", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//passport config
app.use(require('express-session')({
	secret: 'Marja on maailma parim naine',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash('error');
	res.locals.success=req.flash('success');
	next();
})

//requiring routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use(indexRoutes);


app.listen(3000, function(){
	console.log('YelpCamp Server Has Started!');
});

// app.listen(process.env.PORT, process.env.IP, function(){
// 	console.log('YelpCamp Server Has Started!');
// })