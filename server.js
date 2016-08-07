var express = require("express");
var path = require('path'); // 第三方中间件
var mongoose = require("mongoose");
//var multer = require('multer');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//route
var routes = require('./router/index');

var app = express();

//database
global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb");

//session
app.use(session({
	secret: 'secret',
	cookie:{
		maxAge: 1000*60*30
	}
}));
//view engine setup
//allow nodejs use html
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// //routes
// require('./router/index')(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(multer());
app.use(cookieParser());
//Add path for static files
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	var err = req.session.error;
	delete req.session.error;
	res.locals.message = "";
	if(err) {
		res.locals.message = '<div class="alert alert-danger"\
		 style="margin-bottom:20px;color:red;">' + err + '</div>';
	}
	next();
});


app.use('/', routes);
app.use('/login', routes);
app.use('/register', routes);
app.use('/logout', routes);
app.use('/user/:id', routes);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//development error handler
if(app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error.html', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error.html', {
		message: err.message,
		error: {}
	});
});


var server = app.listen(3000, function() {
	console.log("Express on port 3000!");
});