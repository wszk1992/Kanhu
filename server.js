var express = require("express");
var app = express();

require('./router/index')(app);

//view engine setup
//allow nodejs use html
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

var server = app.listen(3000, function() {
	console.log("Express on port 3000!");
});