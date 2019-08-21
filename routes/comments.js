var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//==============================================================
//==================COMMENTS ROUTES=============================
//==============================================================

router.get("/products/:id/comments/new", middleware.isLoggedIn, (request, response) => {
	//find product by id
	Product.findById(request.params.id, (err, product) => {
		if (err){
			console.log(err);
		}
		else{
			response.render("comments/new", {product: product});

		}
	});
});

router.post("/products/:id/comments", middleware.isLoggedIn, (request, response) => {
	//lookup product using ID
	Product.findById(request.params.id, (err, product) => {
		if(err){
			console.log(err);
			response.redirect("/products");
		}
		else {
			Comment.create(request.body.comment, (err, comment) => {
				if(err){
					request.flash("error", "Something went wrong.");
					console.log(err);
				}
				else{
					//add user name and id to comment
					comment.author.id = request.user._id;
					comment.author.username = request.user.username;
					//save comment
					comment.save();
					product.comments.push(comment);
					product.save();
					request.flash("success", "Successfully added comment.");
					response.redirect("/products/" + product._id);
				}
			});
		}
	});
	//create a new comment
	//connect a new comment
	//redirect to product show page
});


//COMMENT EDIT Route
router.get("/products/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (request, response) => {
	Comment.findById(request.params.comment_id, function(err, foundComment){
		if(err){
			response.redirect("back");
		}
		else{
			response.render("comments/edit", {product_id: request.params.id, comment: foundComment});

		}
	});
});

//COMMENT UPDATE Route
router.put("/products/:id/comments/:comment_id", middleware.checkCommentOwnership, (request, response) => {
	Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, (err, updatedComment) => {
		if(err) {
			response.redirect("back");
		}
		else {
			response.redirect("/products/" + request.params.id)
		}
	});
});


//COMMENT DESTROY Route
router.delete("/products/:id/comments/:comment_id", middleware.checkCommentOwnership, (request, response) => {
	Comment.findByIdAndRemove(request.params.comment_id, (err) => {
		if(err){
			response.redirect("back");	
		}
		else{
			request.flash("success", "Comment deleted!")
			response.redirect("/products/" + request.params.id);
		}
	});
	
});



module.exports = router;




