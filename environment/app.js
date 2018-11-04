// Says that the project will need the Express library
var express = require("express");

// Create the express() object.
var app = express();


// TODO: Put SQlite3 dependencies here. 
var sqlite3 = require("sqlite3").verbose();


/*
var connection = mysql.createConnection({
   host: 'bananacat.c7dnoyrsskf4.us-west-1.rds.amazonaws.com',
   port: '3306',
   user: 'BananaCat362',
   password: 'catcpsc362',
   database: 'JonathanBedoy'
});



var results = null;
var n = "Bedoy";
var templateA = "SELECT * FROM User WHERE LastName = ";

connection.connect(function(err) {
   if(err) {
      console.error('Database connection failed: ' + err.stack);
      return;
   }
   console.log('Connected to database');
   if (err) throw err;
   
   connection.query("SELECT * FROM User WHERE LastName = 'Bedoy'", function (err, result, fields) {
    if (err) throw err;
    var results = result;
    console.log(result);
    app.get('/myaccount', function(req, res){
   res.render('pages/myaccount',{user: result});
});

  });
});

*/
var db = new sqlite3.Database('BananaCat.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Conntected to the BananaCat database.');	
});

db.serialize(function(){
	db.each("SELECT * FROM User", function(err, result) {
	
	if (err) {
		console.error(err.message);
	}
	console.log(result);
	
	app.get('/myaccount', function(req, res){
   res.render('pages/myaccount',{user: result});
		});
	});
});

/*db.close((err){
	if (err) {
		console.error(err.message);
	}
	console.log('Close the database connection.');
}); 
*/
// Set the view engine to EJS. This means we're loading dynamic HTML files through EJS.
app.set('view engine', 'ejs');

// Renders the home/index page.
app.get('/', function(req, res){ 
   res.render('pages/index');
});

app.get('/products', function(req, res){
   res.render('pages/products');
});

app.get('/apparel', function(req, res){
   res.render('pages/apparel'); 
});

app.get('/register', function(req, res){
   res.render('pages/register');
});

app.get('/login', function(req, res){
   res.render('pages/login');
});



app.get('/booksandmanga', function(req, res){
   res.render('pages/booksandmanga');
});

app.get('/figurines', function(req, res){
   res.render('pages/figurines');
});

app.get('/snacks', function(req, res){
   res.render('pages/snacks');
});

// Starts the server!
app.listen(8080, function(){
   console.log("Server has started!");
});
