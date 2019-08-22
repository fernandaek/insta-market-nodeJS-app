var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var middleware = require("../middleware");
var multer = require("multer");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'fernandaek', 
  api_key: 288584932748768, 
  api_secret: "OBoyJzz-6JC4-WnODg9KA9-uuqw"
});


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
router.post("/products", middleware.isLoggedIn, upload.single('image'), (request, response) => {
//get data from form
	cloudinary.uploader.upload(request.file.path, function(result) {
  // add cloudinary url for the image to the product object under image property
  request.body.product.image = result.secure_url;
  // add author to product
  request.body.product.author = {
    id: request.user._id,
    username: request.user.username
  }
  Product.create(request.body.product, function(err, product) {
    if (err) {
      request.flash('error', err.message);
      return response.redirect('back');
    }
    response.redirect('/products/' + product.id);
 	 });
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


