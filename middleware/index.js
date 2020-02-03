Campground 		= require('../models/campgrounds'),
Comment 		= require('../models/comments');

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampGround){
			if(err || !foundCampGround){
				req.flash('error', 'Campground not found');
				res.redirect('back');
			} else {
				//does user own campground?
				if(foundCampGround.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You dont have permission to do that!");
					res.redirect('back');
				}
			}
		})
	//if user in not logged in redirect back
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership=function(req, res, next){
	//check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || ! foundComment){
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				//does user own comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You dont have permission to do that!");
					res.redirect('back');
				}
			}
		})
	//if user in not logged in redirect back
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect('/login');
}


module.exports=middlewareObj;