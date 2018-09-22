var express 		= require('express');
var router  		= express.Router({mergeParams : true});

var Photo 		= require('../models/photo');
var Comment 		= require('../models/comment');
var middleware		= require('../middleware')

// Comments New

router.get("/new", middleware.isLoggedIn, function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {photo : photo});
		}
	});
});

// Comments create

router.post("/", middleware.isLoggedIn, function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err) {
			console.log(err);
			res.redirect("/photos");
		} else {
			Comment.create(req.body.comments, function(err, comment){
				if(err) {
					console.log(err);
				} else {

					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;

					// Save comment
					comment.save();

					photo.comments.push(comment);
					photo.save();
					req.flash("success", "Successfully added a comment!");
					res.redirect('/photos/' + photo._id);
				}
			});
		}
	});
});

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			// req.flash("error", "Something went wrong! Please try again!");
			console.log(err);
		} else {
			res.render("comments/edit", {photo_id : req.params.id, comment : foundComment});
		}
	});
});

// Comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			req.flash("error", "Something went wrong! Please try again!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment successfully edited!");
			res.redirect("/photos/" + req.params.id);
		}
	});
});

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err) {
			req.flash("error", "Something went wrong! Please try again!");
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/photos/" + req.params.id);
		}
	});
});

module.exports = router;