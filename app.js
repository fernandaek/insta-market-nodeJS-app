var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"); //mongoose.set('useNewUrlParser', true);//updating
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Product = require("./models/product.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var commentRoutes    = require("./routes/comments"),
	productRoutes = require("./routes/products"),
	indexRoutes		 = require("./routes/index")

var url = process.env.DATABASEURL || "mongodb://localhost:27017/product_v1";
mongoose.connect(url, {useNewUrlParser: true});//creating a database in mongodb named product_version1



//===============================================================================================================================
//================================DELETE IT BEFORE DEPLOY========================================================================

//mongoose.connect("mongodb+srv://fernandaek:!RrkV.GkWNRd96J@cluster0-srmlq.mongodb.net/test?retryWrites=true&w=majority", 
//				 {useNewUrlParser: true, useCreateIndex: true}).then(() => { //creating a database in mongodb named producr_v1
//					console.log("Connected to DB");
//				}).catch(err => {
//					console.log("ERROR: " + err.message);
//				});
//app.use(bodyParser.urlencoded({extended: true}));

//=================================DELETE IT BEFORE DEPLOY========================================================================
//================================================================================================================================




app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs" );

//app.use(express.static(__dirname + "/public")); //dirname makes it safer and you dont loose the css data
app.use(express.static(__dirname + '/public'));

app.use(methodOverride("_method"));

app.use(flash());

//seedDB(); // seed the DB

//===============================================
//===========PASSPORT CONFIG=====================
//===============================================

app.use(require("express-session")({
	secret: "Luna is the best dog in the world",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());//setting passport app to work in our application
app.use(passport.session());//setting passport app to work in our application

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //resposible to read the session, taking the date from the session that is uncoded and encode it
passport.deserializeUser(User.deserializeUser()); //decode 

app.use((request, respons, next) => {
	respons.locals.currentUser = request.user;
	respons.locals.error = request.flash("error");
	respons.locals.success = request.flash("success");
	next();
});

app.use(indexRoutes);
app.use(productRoutes);
app.use(commentRoutes);



app.listen(process.env.PORT || 3000, () => {
	console.log("The YelpCamp server has started!");
});










