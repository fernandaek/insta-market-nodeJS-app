var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var middleware = require("../middleware");

//INDEX ROUTE - Show all products
router.get("/products", (request, response) =>{
	//console.log(request.user);
	Product.find({}, (err, allProducts) => {
	if(err){
		console.log(err);
	}else{
		response.render("products/index", {products:allProducts});
	}
});
});


//NEW ROUTE - Show form to create a new product //This need be declared first then /:id
router.get("/products/new", middleware.isLoggedIn, (request, response) => {
	response.render("products/new.ejs");
});


//SHOW -show more info about one product
router.get("/products/:id", (request, response) => {
	//find the product with provided ID;
	Product.findById(request.params.id).populate("comments").exec((err, foundProduct) => {
		if(err){
			console.log(err)
		}
		else{
			console.log(foundProduct)
			//render show template with product;
	response.render("products/show", {product: foundProduct});
		}
	});
});

//CREATE ROUTE - Add new product to DB
router.post("/products", middleware.isLoggedIn, (request, response) => {
//get data from form
		var name = request.body.name;
		var price = request.body.price;
		var image = request.body.image;
		var desc = request.body.description;
		var author = {
			id: request.user._id,
			username: request.user.username
		}
		var newProduct = {name: name, price: price, image: image, description: desc, author: author}
		
		//products.push(newProduct);
		Product.create(newProduct, (err, newlyCreated)=>{
			if(err){
				console.log(err);
			}else{
	//Redirect  back to products page
		response.redirect("/products");
			}
		});
});

//EDIT a product route
router.get("/products/:id/edit", middleware.checkProductOwnership, (request, response) => {
	Product.findById(request.params.id, (err, foundProduct) => {
		response.render("products/edit", {product: foundProduct});
	});
});

//UPDATE a product route
router.put("/products/:id", middleware.checkProductOwnership, (request, response) => {
	//find and update the correct product
	Product.findByIdAndUpdate(request.params.id, request.body.product, (err, UpdatedProduct) => {
		if(err){
			response.redirect("/products");
		}
		else{
			response.redirect("/products/" + request.params.id);
		}
	});
});

//DESTROY product route
router.delete("/products/:id", middleware.checkProductOwnership, (request, response) => {
	Product.findByIdAndRemove(request.params.id, (err) => {
		if(err){
			response.redirect("/products");
		}
		else{
			response.redirect("/products");
		}
	});
});




module.exports = router;


