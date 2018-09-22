var express 		= require('express');
var router  		= express.Router(); 
var Photo 			= require('../models/photo');
var middleware		= require('../middleware')

// Show all photos
router.get("/", function(req, res){
	Photo.find({}, function(err, allPhotos){
		if(err){
			console.log(err)
		} else {
			res.render("photos/index", {photos : allPhotos});
		}
	});
});

// Create - add a new photo to Database
router.post("/", middleware.isLoggedIn ,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author_note = req.body.author_note;
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	var newPhoto = {name: name, image: image, description : description, author_note : author_note, author : author};

	Photo.create(newPhoto, function(err,newlyCreatedphoto){
		if(err){
			console(err);
		} else {
			req.flash("success", "Successfully added a new photo!");
			res.redirect("/photos");
		}
	});
});

// Show form to create new photo
router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("photos/new");
});

// Show photo
router.get("/:id", function(req,res){
	Photo.findById(req.params.id).populate("comments").exec(function(err,foundPhoto){
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong! Please try again!");
			res.redirect("/photos");
		} else {
			// console.log(foundPhoto);
			res.render("photos/show", {photo : foundPhoto});
		}
	});
});

// Edit Photo

router.get("/:id/edit", middleware.checkPhotoOwnership, function(req,res){
	Photo.findById(req.params.id, function(err, foundPhoto){
		res.render("photos/edit", {photo : foundPhoto});
	});
});

// Update Photo
router.put("/:id", middleware.checkPhotoOwnership, function(req,res){
	Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong! Please try again!");
			res.redirect("/photos");
		} else {
			req.flash("success", "Photo edited successfully!");
			res.redirect("/photos/" + req.params.id);
		}
	});
});

// Destroy photo
router.delete("/:id", middleware.checkPhotoOwnership, function(req, res){
	Photo.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			req.flash("error", "Something went wrong! Please try again!");
			res.redirect("/photos");
		} else {
			req.flash("success", "Photo deleted!");
			res.redirect("/photos");
		}
	});
});

module.exports = router;