var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
	name : String,
	image: String,
	description : String,
	author_note : String,
	author : {
		id : {
			type : mongoose.Schema.ObjectId,
			ref : "User"
		},
		username : String
	},
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
});

module.exports = mongoose.model("Photo", photoSchema)