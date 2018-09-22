var express			 		= require('express'),
	mongoose		 		= require('mongoose'),
	bodyParser		 		= require('body-parser'),
	passport		 		= require('passport'),
	LocalStrategy	 		= require('passport-local'),
	methodOverride			= require('method-override'),
	passportLocalMongoose	= require('passport-local-mongoose'),
	expressSession 			= require('express-session'),
	Photo					= require('./models/photo'),
	Comment 				= require('./models/comment'),
	flash					= require('connect-flash'),
	User					= require('./models/user');

var commentRoutes 			= require("./routes/comments"),
	photoRoutes				= require("./routes/photos"),
	indexRoutes				= require("./routes/index");	

mongoose.connect("mongodb://anupam:anupam11<dbpassword>@ds159812.mlab.com:59812/photoworld", { useNewUrlParser: true });

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "One true God",
	resave : false,
	saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom defined middleware to pass req.user in every single route

app.use(function(req, res, next){
	res.locals.currentUser  = req.user;
	res.locals.error 		= req.flash("error");
	res.locals.success	    = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/photos", photoRoutes);
app.use("/photos/:id/comments", commentRoutes);

// Listening to the server

app.listen(process.env.PORT || 8000, function(req, res){
	console.log("Server Started!");
});	