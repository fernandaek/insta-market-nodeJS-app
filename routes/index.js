var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/", (request, response) => {
	response.render("landing")
});

//==============================================================
//==================AUTHENTICATION ROUTES=======================
//==============================================================

//show register form
router.get("/register", (request, response) => {
	response.render("register");
});

//handle sign up logic
router.post("/register", (request, response) => {
	var newUser = new User({username: request.body.username});
	User.register(newUser, request.body.password, (err, user) => {
		if (err){
			request.flash("error", err.message);
			return response.redirect("register");
		}
		passport.authenticate("local")(request, response, () => {
			request.flash("success", "Welcome to YelpCamp " + user.username);//request.body.username 
			response.redirect("/products");
		});
	});
});

//show login form
router.get("/login", (request, response) => {
	response.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local", { //middleware: passport.authenticate...
	successRedirect: "/products",
	failureRedirect: "/login"
}), (request, response) => {});


//handling logout logic
router.get("/logout", (request, response) => {
	request.logout();
	request.flash("success", "Logged you out");
	response.redirect("/products");
});





module.exports = router;

