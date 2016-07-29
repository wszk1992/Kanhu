var express = require("express");
var path = require('path'); // 第三方中间件
//var mongoose = require("mongoose");
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//route
var routes = require('./router/index');
var users = require('./router/users');

var app = express();
//var Schema = mongoose.Schema;

//view engine setup
//allow nodejs use html
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// //routes
// require('./router/index')(app);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
//Add path for static files
app.use(express.static(__dirname + '/public'));

app.use('/', routes);
//app.use('/users', users);


//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//development error handler
if(app.get('env') == 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

//@@@DATABASE

// //url
// url = 'mongodb://127.0.0.1:27017/kanhu';
// var connect = mongoose.connect(url);

// //Define object model
// var UserScheme = new Schema({
// 	username: {type: String, default: 'Foo'},
// 	password: {type: String, default: '123456'},
// });

//@@@DATABASE

var server = app.listen(3000, function() {
	console.log("Express on port 3000!");
});