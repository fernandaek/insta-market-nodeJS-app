var Product = require("../models/product");
var Comment = require("../models/comment");

//ALL MIDDLEWARE GOES HERE

var middlewareObj = {};


//CHECKING PRODUCTS
middlewareObj.checkProductOwnership = function(request, response, next) {
	//is user logged in?
		if(request.isAuthenticated()){
			Product.findById(request.params.id, (err, foundProduct) => {
				if(err){
					request.flash("error", "Product not found.");
					response.redirect("back");
				}
				else {
	//is the user the owner of the product?
				if(foundProduct.author.id.equals(request.user._id) || request.user.isAdmin){ //the method equals()is provided by mongoose
					next();
				}
				else {
					request.flash("error", "You don't have permission to do that!")
					response.redirect("back");
				}
			}
		});
	}
		else{
			request.flash("error", "You need to be logged in to do that!");
			response.redirect("back");
		}
	}


//CHECKING COMMENTS
middlewareObj.checkCommentOwnership = function(request, response, next) {
	//is user logged in?
		if(request.isAuthenticated()){
			Comment.findById(request.params.comment_id, (err, foundComment) => {
		if(err){
			response.redirect("back");
		}
		else {
			//is the user the owner of the comment?
			if(foundComment.author.id.equals(request.user._id)){ //the method equals()is provided by mongoose
				next();
			}
			else {
				request.flash("error", "You don't have permission to do that!")
				response.redirect("back");
			}
		}
	});
		}else{
			request.flash("error", "You need to be logged in to do that!");
			response.redirect("back");
		}
}

//IS LOGGED IN 
middlewareObj.isLoggedIn = function(request, response, next){
	if(request.isAuthenticated()){
		return next();
	}
	request.flash("error", "You need to be logged in to do that!");
	response.redirect("/login");
}





module.exports = middlewareObj