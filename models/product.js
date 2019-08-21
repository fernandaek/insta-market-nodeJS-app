var mongoose = require("mongoose");

	//setting up Schema
	var productSchema = new mongoose.Schema({
		name: String,
		price: String,
		image: String,
		description: String,
		location: String,
		coordinates: Array,
		author: {
			id:{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username: String
		},
		comments:[
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment"
			}
		]
	});

	module.exports = mongoose.model("Product", productSchema);
