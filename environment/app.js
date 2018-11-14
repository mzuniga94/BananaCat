
// Says that the project will need the Express library
var express = require('express');
var bodyParser = require('body-parser');
// TODO: Put SQlite3 dependencies here. 
var sqlite3 = require('sqlite3').verbose();

// Create the express() object.
var app = express();

var db = new sqlite3.Database('BananaCat.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Conntected to the BananaCat database.');	
});

db.serialize(function(){
	db.run("CREATE TABLE IF NOT EXISTS [Account](first_name TEXT NOT NULL,"+
																"last_name TEXT NOT NULL,"+
																"email TEXT NOT NULL UNIQUE PRIMARY KEY,"+
																"password TEXT NOT NULL,"+
																"address TEXT NOT NULL,"+
																"city TEXT NOT NULL,"+
																"state TEXT NOT NULL,"+
																"zip_code INTEGER NOT NULL)");
	
	db.run("CREATE TABLE IF NOT EXISTS [Book](book_id TEXT NOT NULL PRIMARY KEY,"+
															"book_title TEXT NOT NULL,"+
															"author_name TEXT NOT NULL,"+
															"genre TEXT NOT NULL,"+
															"book_price TEXT NOT NULL)");
	
	db.run("CREATE TABLE IF NOT EXISTS [Figurine](figurine_id TEXT NOT NULL PRIMARY KEY,"+
																"figurine_brand TEXT NOT NULL,"+
																"figurine_name TEXT NOT NULL,"+
	 															"figurine_desc TEXT NOT NULL,"+
																"figurine_price TEXT NOT NULL)");
																
	db.run("CREATE TABLE IF NOT EXISTS [Apparel](apparel_id TEXT NOT NULL PRIMARY KEY,"+
																"apparel_brand TEXT NOT NULL,"+
																"apparel_name TEXT NOT NULL,"+
																"apparel_desc TEXT NOT NULL,"+
																"apparel_price TEXT NOT NULL)");
																
	db.run("CREATE TABLE IF NOT EXISTS [VideoGame](vgame_id TEXT NOT NULL PRIMARY KEY,"+
																  "platform TEXT NOT NULL,"+
																  "	vgame_name TEXT NOT NULL,"+
																  "vgame_desc TEXT NOT NULL,"+
																  "vgame_price TEXT NOT NULL)");
																  
	db.run("CREATE TABLE IF NOT EXISTS [Snack](snack_id TEXT NOT NULL PRIMARY KEY,"+
															 "snack_brand TEXT NOT NULL,"+
															 "snack_name TEXT NOT NULL,"+
															 "snack_desc TEXT NOT NULL,"+
															 "snack_price TEXT NOT NULL)");
															 
	db.run("CREATE TABLE IF NOT EXISTS [Picture](pic_id TEXT NOT NULL PRIMARY KEY,"+
																"pic_name TEXT NOT NULL,"+
																"picture BLOB)");
															 											 
});

/*
db.serialize(function(){
	db.each("SELECT * FROM Account", function(err, result) {
	
	if (err) {
		console.error(err.message);
	}
	console.log(result);
	
	});
});

/*
db.close((err){
	if (err) {
		console.error(err.message);
	}
	console.log('Close the database connection.');
}); 

 */

// Set the view engine to EJS. This means we're loading dynamic HTML files through EJS.
app.set('view engine', 'ejs');
app.use(express.static('partials'));

// For parsing application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Renders the home/index page.
app.get('/', function(req, res) {
  res.render('pages/index', { title: 'BananaCat'});
});

app.get('/register', function(req, res) {
  res.render('pages/register', { title: 'Register'});
});

app.post('/register',function(req,res){
	var f_name = req.body.fname;
	var l_name = req.body.lname;
	var email_ = req.body.inputEmail4;
	var password_ = req.body.inputPassword4;
	var address_ = req.body.inputAddress;
	var city_ = req.body.inputCity;
	var state_ = req.body.inputState;
	var z_code = req.body.inputZip;
	
	console.log("First Name = "+f_name+", Last Name = "+l_name+",Email = "+email_+",Password = " +password_);
	
	db.run('INSERT INTO Account(first_name,last_name,email,password,address,city,state,zip_code)'
	+'VALUES(?,?,?,?,?,?,?,?)',[f_name,l_name,email_,password_,address_,city_,state_,z_code]);

	res.end("yes");
});

app.locals.myVar = 1;
let sql = 'Select * from Account';
app.get('/myaccount', function(req, res) {
   db.all(sql, [], (err, rows) => {
	if (err) {
		throw err;
	}
	console.log(rows);
	res.render('pages/myaccount', { title: 'myaccount', myacc : rows });
	});
   
});
	
app.get('/apparel', function(req, res){
   res.render('pages/apparel', { title: 'Apparel' }); 
});

app.get('/login', function(req, res){
   res.render('pages/login', { title: 'Login' });
});

app.post('/login', function(req,res){

	var email = req.body.inputEmail;
	var password = req.body.inputPassword;
	console.log("Email = "+email+", password is "+password);
	res.end("yes");
	
	db.each("SELECT * FROM Account", function(err, result) {
	
	if (err) {
		console.error(err.message);
	}
	console.log(result);
	
	});

});


app.get('/booksandmanga', function(req, res){
   res.render('pages/booksandmanga', { title: 'Books and Manga' });
});

app.get('/figurines', function(req, res){
   res.render('pages/figurines', { title: 'Figurines' });
});

app.get('/snacks', function(req, res){
   res.render('pages/snacks', { title: 'Snacks' });
});

app.get('/videogames', function(req, res){
   res.render('pages/videogames', { title: 'Video Games' });
});

// Starts the server!
app.listen(8080, function(){
   console.log("Server has started!");
});
