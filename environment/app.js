// Says that the project will need the Express library
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var review = []; /* For adding a review. Will need a separate table in the database eventually */

//myVar = is user logged in? boolean
myVar = 0;
//userVar = when user is logged in all data stored here
userVar = 0;

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

	db.run("CREATE TABLE IF NOT EXISTS [Account]("+
		"first_name TEXT NOT NULL,"+
		"last_name TEXT NOT NULL,"+
		"email TEXT NOT NULL UNIQUE PRIMARY KEY,"+
		"password TEXT NOT NULL,"+
		"address TEXT NOT NULL,"+
		"city TEXT NOT NULL,"+
		"state TEXT NOT NULL,"+
		"zip_code INTEGER NOT NULL)");
			
	
	db.run("CREATE TABLE IF NOT EXISTS [Book]("+
		"book_id TEXT NOT NULL PRIMARY KEY,"+
		"book_title TEXT NOT NULL,"+
		"author_name TEXT NOT NULL,"+
		"genre TEXT NOT NULL,"+
		"book_price TEXT NOT NULL,"+
		"FOREIGN KEY(book_id) REFERENCES Picture(pic_id))");
	
	db.run("CREATE TABLE IF NOT EXISTS [Figurine]("+
		"figurine_id TEXT NOT NULL PRIMARY KEY,"+
		"figurine_brand TEXT NOT NULL,"+
		"figurine_name TEXT NOT NULL,"+
		"figurine_desc TEXT NOT NULL,"+
		"figurine_price TEXT NOT NULL,"+
		"FOREIGN KEY(figurine_id) REFERENCES Picture(pic_id))");
																
	db.run("CREATE TABLE IF NOT EXISTS [Apparel]("+
		"apparel_id TEXT NOT NULL PRIMARY KEY,"+
		"apparel_brand TEXT NOT NULL,"+
		"apparel_name TEXT NOT NULL,"+
		"apparel_size TEXT NOT NULL,"+
		"apparel_desc TEXT NOT NULL,"+
		"apparel_price TEXT NOT NULL,"+
		"FOREIGN KEY(apparel_id) REFERENCES Picture(pic_id))");
																
	db.run("CREATE TABLE IF NOT EXISTS [VideoGame]("+
		"vgame_id TEXT NOT NULL PRIMARY KEY,"+
		"platform TEXT NOT NULL,"+
		"vgame_name TEXT NOT NULL,"+
		"vgame_desc TEXT NOT NULL,"+
		"vgame_price TEXT NOT NULL,"+
		"FOREIGN KEY(vgame_id) REFERENCES Picture(pic_id))");
																  
	db.run("CREATE TABLE IF NOT EXISTS [Snack]("+
		"snack_id TEXT NOT NULL PRIMARY KEY,"+
		"snack_brand TEXT NOT NULL,"+
		"snack_name TEXT NOT NULL,"+
		"snack_desc TEXT NOT NULL,"+
		"snack_price TEXT NOT NULL,"+
		"FOREIGN KEY(snack_id) REFERENCES Picture(pic_id))");
															 
	db.run("CREATE TABLE IF NOT EXISTS [Picture]("+
		"pic_id TEXT NOT NULL PRIMARY KEY,"+
		"pic_name TEXT NOT NULL,"+
		"picture BLOB)");
															 		
	db.run("CREATE TABLE IF NOT EXISTS [Review]("+
		"review_id TEXT NOT NULL PRIMARY KEY,"+
		"review_item TEXT,"+
		"review_comment TEXT)");
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
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'partials')));
app.set('view engine', 'ejs');
app.use(express.static('partials'));

// For parsing application/x-www-form-urlendcoded
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Renders the home/index page.
app.get('/', function(req, res) {
  res.render('pages/index', {title: 'BananaCat'});
});

app.get('/register', function(req, res) {
  res.render('pages/register', { title: 'Register', myVar});
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
	

	db.each("SELECT * FROM Account WHERE email = '"+email_+"' AND password = '"+password_+"'", function(err, result){

		myVar = 1;
		console.log("Registration successful! myVar = ", myVar);
		userVar = result;
	});
	res.end("yes");
});

let sql = 'Select * from Apparel';

app.get('/myaccount', function(req, res) {
   //db.all(sql, [], (err, rows) => {
	//if (err) {
	//	throw err;
	//}
	//console.log(rows);
	//console.log("myVar = ", myVar);
	//console.log(userVar);
	res.render('pages/myaccount', { title: 'myaccount', userVar, myVar});
	//});
   
});

app.get('/head', function(req, res) {
	res.render('partials/head', { title: 'head', userVar, myVar});   
});

/* START APPAREL ROUTES */

app.get('/apparel', function(req, res){
   
	db.all(sql, [], (err, rows) => {
	
	if (err) {
		console.error(err.message);
	}
	res.render('pages/apparel', { title: 'Apparel', rows}); 
	//console.log(rows);
	
	});
});

app.get('/iviews/:id', function(req, res){
       //console.log(req.params.id);
	db.each("SELECT * FROM Apparel WHERE Apparel_ID = '"+req.params.id+"'",function(err, result){
		//console.log(result);
		res.render('pages/iviews', { title: 'Item Views', review: review, result});
		});
});

app.get('/iviewsf/:id', function(req, res){
       //console.log(req.params.id);
	db.each("SELECT * FROM Figurine WHERE Figurine_ID = '"+req.params.id+"'",function(err, result){
		console.log(result);
		res.render('pages/iviewsf', { title: 'Item Views', review: review, result});
		});
});

app.get('/iviewsb/:id', function(req, res){
       //console.log(req.params.id);
	db.each("SELECT * FROM book WHERE book_ID = '"+req.params.id+"'",function(err, result){
		console.log(result);
		res.render('pages/iviewsb', { title: 'Item Views', review: review, result});
		});
});

app.get('/iviewsv/:id', function(req, res){
       //console.log(req.params.id);
	db.each("SELECT * FROM VideoGame WHERE vgame_ID = '"+req.params.id+"'",function(err, result){
		console.log(result);
		res.render('pages/iviewsv', { title: 'Item Views', review: review, result});
		});
});

app.get('/midoriyahoodie', function(req, res){
	db.each("SELECT * FROM Apparel WHERE Apparel_ID = '00009'",function(err, result){
		//console.log(result);
		res.render('pages/midoriyahoodie', { title: 'Midoriya Hoodie', review: review, result});
		});

});

app.post('/addreview', function(req, res){
	var newReview = req.body.newreview;
	review.push(newReview);
	res.redirect('/midoriyahoodie');
});

app.get('/login', function(req, res){
   res.render('pages/login', { title: 'Login', myVar });
   
   

});

app.post('/login', function(req, res){
	var logEmail = req.body.inputEmail;
	var logPassword = req.body.inputPassword;
	if(logEmail === logPassword) {
		myVar = 0;
		console.log("Logout successful! myVar = ", myVar);
		res.end("yes");
	} else { 
		db.each("SELECT * FROM Account WHERE email = '"+logEmail+"' AND password = '"+logPassword+"'",function(err, result){

		myVar = 1;
		console.log("login successful! myVar = ", myVar);
		userVar = result;
		res.end("yes");
		});
	}
		
		
});


app.get('/booksandmanga', function(req, res){
   //res.render('pages/booksandmanga', { title: 'Books and Manga' });
	db.all('select * from Book', [], (err, rows) => {
	
	if (err) {
		console.error(err.message);
	}
	res.render('pages/booksandmanga', { title: 'Books and Manga', rows}); 
	//console.log(rows);
	
	});
});

app.get('/figurines', function(req, res){
   //res.render('pages/figurines', { title: 'Figurines' });
	db.all('select * from figurine', [], (err, rows) => {
	
	if (err) {
		console.error(err.message);
	}
	res.render('pages/figurines', { title: 'Figurines', rows}); 
	//console.log(rows);
	
	});
});

app.get('/snacks', function(req, res){
   res.render('pages/snacks', { title: 'Snacks' });
});

app.get('/videogames', function(req, res){
   //res.render('pages/videogames', { title: 'Video Games' });
	db.all('select * from VideoGame', [], (err, rows) => {
	
	if (err) {
		console.error(err.message);
	}
	res.render('pages/videogames', { title: 'Video Games', rows}); 
	//console.log(rows);
	
	});
});

app.get('/contactus', function(req, res){
   res.render('pages/contactus', { title: 'Contact Us' });
});

app.get('/feedback', function(req, res){
   res.render('pages/feedback', { title: 'Feedback'});
});

var inv1, inv2, inv3;

app.get('/inventory', function(req, res){
	//res.render('pages/inventory', { title: 'Inventory'});
	
	db.all('SELECT DISTINCT(B.book_id) AS Book_ID, B.book_title AS Book_Name, B.author_name AS Book_Author, B.book_price AS Book_Price, B.book_quantity AS Book_Quantity'+
				' FROM Book AS B'+
				' GROUP BY B.book_id ORDER BY B.book_id', function(err1, result1){
					inv1 = result1;
					console.log(result1);
				});

	db.all('SELECT DISTINCT(A.apparel_id) AS Apparel_ID, A.apparel_brand AS Apparel_Brand, A.apparel_name AS Apparel_Name, A.apparel_size AS Apparel_Size, A.apparel_price AS Apparel_Price, A.apparel_quantity AS Apparel_Quantity'+
				' FROM Apparel AS A'+
				' GROUP BY A.apparel_id ORDER BY A.apparel_id', function(err2, result2){
				inv2 = result2;
					console.log(result2);
				});

	db.all('SELECT DISTINCT(F.figurine_id) AS Figurine_ID, F.figurine_brand AS Figurine_Brand, F.figurine_name AS Figurine_Name, F.figurine_price AS Figurine_Price, F.figurine_quantity AS Figurine_Quantity'+
				' FROM Figurine AS F'+
				' GROUP BY F.figurine_id ORDER BY F.figurine_id', function(err3, result3){
				
					inv3 = result3;
					console.log(result3);
			});
	
	db.all('SELECT DISTINCT(S.snack_id) AS Snack_ID, S.snack_brand AS Snack_Brand, S.snack_name AS Snack_Name, S.snack_desc AS Snack_Desc, S.snack_price AS Snack_Price, S.snack_quantity AS Snack_Quantity'+
				' FROM Snack AS S'+
				' GROUP BY S.snack_id ORDER BY S.snack_id', function(err4, result4){
				
				inv4 = result4;
				console.log(result4);
			});
			
	db.all('SELECT DISTINCT(V.vgame_id) AS Vgame_ID, V.platform AS Platform, V.vgame_name AS Vgame_Name, V.vgame_desc AS Vgame_Desc, V.vgame_price AS Vgame_Price, V.vgame_quantity AS Vgame_Quantity'+
				' FROM VideoGame AS V'+
				' GROUP BY V.vgame_id ORDER BY V.vgame_id', function(err5, result5){
				
				inv5 = result5;
				res.render('pages/inventory', {title: 'Inventory', inv1, inv2, inv3,inv4,inv5});
				console.log(result5);
			});
				
	
});

// Starts the server!
app.listen(8080, function(){
   console.log("Server has started!");
});
